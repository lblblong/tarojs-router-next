import { PropertySignature, TypeAliasDeclaration, TypeChecker, VariableDeclaration } from 'ts-morph'
import * as ts from 'typescript'

export function extractType(options: { name: string; declaration: TypeAliasDeclaration; checker: TypeChecker }) {
  const { name, declaration, checker } = options

  if (!TypeAliasDeclaration.is(declaration.getKind())) throw Error(`${name} 应该导出类型定义`)
  let optional = true
  for (const p of declaration.getType().getProperties()) {
    const ds = p.getDeclarations() as PropertySignature[]
    if (ds.length > 1) throw Error('未知错误')
    if (!ds[0].getQuestionTokenNode()) {
      optional = false
      break
    }
  }

  const text = checker.getTypeText(declaration.getType(), declaration.getTypeNode(), ts.TypeFormatFlags.InTypeAlias)

  return {
    text,
    optional,
    name,
  }
}

export function extractValue(options: { name: string; declaration: VariableDeclaration; checker: TypeChecker }) {
  const { name, declaration, checker } = options

  if (!VariableDeclaration.is(declaration.getKind())) throw Error(`${name} 应该导出变量类型`)

  const text = declaration.getFullText()

  return text.split('=', 2)[1].trim()
}

export function formatPageDir(dirName: string) {
  return dirName
    .replace(/\-/g, '_')
    .replace(/\_(\w)/g, (all, letter) => {
      return letter.toUpperCase()
    })
    .replace(/^\S/, (s) => s.toUpperCase())
}
