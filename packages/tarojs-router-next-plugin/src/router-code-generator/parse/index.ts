import { IPluginContext } from '@tarojs/service'
import fs from 'fs'
import path from 'path'
import { IConfig } from 'src/config'
import { Project, SourceFile } from 'ts-morph'
import { Page } from '../entites/page'
import { extractType, extractValue } from '../util'
import { QueryMeta } from './type'

export class Parser {
  private pagesPath: string
  constructor(private readonly ctx: IPluginContext, private config: IConfig) {
    this.pagesPath = path.resolve(this.ctx.paths.sourcePath, 'pages')
  }

  start() {
    const { pagesPath } = this
    const project = new Project()
    project.addSourceFilesAtPaths(this.pagesPath + '/**/route.config.ts')
    project.resolveSourceFileDependencies()
    const configSourceFiles = project
      .getSourceFiles()
      .filter((it) => it.compilerNode.fileName.endsWith('route.config.ts'))

    const pages = fs.readdirSync(pagesPath).map((d) => {
      const p = new Page()
      p.dir = d
      p.fullDir = path.resolve(pagesPath, d)
      console.log('发现页面：', p.fullDir)
      return p
    })

    for (const sourceFile of configSourceFiles) {
      const page = pages.find((p) => {
        return path.resolve(p.fullDir, 'route.config.ts') === path.normalize(sourceFile.compilerNode.fileName)
      })
      if (!page) continue
      this.parseSourceFile({
        page,
        project,
        sourceFile,
      })
    }

    return pages
  }

  parseSourceFile(options: { page: Page; project: Project; sourceFile: SourceFile }) {
    const { page, project, sourceFile } = options
    const checker = project.getTypeChecker()

    const pageQuery: {
      params?: QueryMeta
      data?: QueryMeta
      ext?: string
    } = {}

    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      if (declarations.length > 1) return
      const declaration = declarations[0] as any
      switch (name) {
        case 'Params':
          pageQuery.params = extractType({
            name,
            declaration,
            checker,
          })
          break
        case 'Data':
          pageQuery.data = extractType({
            name,
            declaration,
            checker,
          })
          break
        case 'Ext':
          pageQuery.ext = extractValue({
            name,
            declaration,
            checker,
          })
          break
      }
    })

    page.query = pageQuery

    return page
  }
}
