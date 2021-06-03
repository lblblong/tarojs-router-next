export interface IConfig {
  watch: boolean
  ignore: string[]
}

export const isDev = process.env.NODE_ENV === 'development'
