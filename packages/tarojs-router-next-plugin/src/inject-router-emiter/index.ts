import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as utils from '@babel/types'
import { IPluginContext } from '@tarojs/service'
import { IConfig } from 'src/config'

export class InjectRouterEmiter {
  constructor(private readonly ctx: IPluginContext, private config: IConfig) {
    this.ctx.modifyBuildAssets(({ assets }) => {
      const pageKeys = Object.keys(assets).filter((k) => /^pages\/(\w|-)+\/(\w|-)*.js$/.test(k))
      for (const key of pageKeys) {
        if (assets[key].emitted) continue
        let pageValue = assets[key].children[0]._value
        pageValue = this.inject(pageValue)
        assets[key].children[0]._value = pageValue
      }
    })
  }

  inject(pageValue: string) {
    if (pageValue.indexOf('originOnUnload') !== -1) return pageValue
    const ast = parse(pageValue)

    const routerAst = parse(
      `var PageData = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/tarojs-router-next/dist/page-data/index.js")['PageData'];`
    )

    traverse(ast, {
      VariableDeclaration(path) {
        if (
          path.node.type === 'VariableDeclaration' &&
          path.node.declarations[0].type === 'VariableDeclarator' &&
          path.node.declarations[0].id.type === 'Identifier' &&
          path.node.declarations[0].id.name === 'inst'
        ) {
          const inst = path.node.declarations[0]
          if (!inst || path.parent.type !== 'BlockStatement') return
          path.parent.body.unshift(routerAst.program.body[0])

          const optionsVar = utils.variableDeclaration('var', [
            utils.variableDeclarator(
              utils.identifier('options'),
              (inst.init as utils.CallExpression).arguments[0] as utils.CallExpression
            ),
          ])

          path.parent.body.splice(path.parent.body.length - 1, 0, optionsVar)

          if (inst.init?.type === 'CallExpression') {
            inst.init.arguments = [utils.identifier('options')]
          }

          let onUnloadAst = parse(`const originOnUnload = options.onUnload
            options.onUnload = function(){
              originOnUnload.bind(this)()
              PageData.emitBack()
            }`)

          path.parent.body.splice(path.parent.body.length - 1, 0, ...onUnloadAst.program.body)
        }
      },
    })

    return generate(ast).code
  }
}
