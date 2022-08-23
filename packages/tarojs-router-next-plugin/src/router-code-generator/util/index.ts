import { VariableDeclaration } from 'ts-morph';

export function extractValue(options: { name: string; declaration: VariableDeclaration }) {
  const { name, declaration } = options

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
