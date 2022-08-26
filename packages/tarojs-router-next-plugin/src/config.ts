export interface IConfigPackage {
  name: string
  pagePath: string
}
export interface IConfig {
  ignore: string[]
  packages: IConfigPackage[]
}

export const isDev = process.env.NODE_ENV === 'development'
