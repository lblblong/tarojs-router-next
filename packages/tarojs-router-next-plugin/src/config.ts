export interface IConfig {
  watch: boolean
}

export const isDev = process.env.NODE_ENV === 'development'
