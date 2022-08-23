import { PackagePageConfig } from './package'
import { PageQuery } from './page-query'

export class Page {
  config?: PackagePageConfig
  dir: string
  path: string
  fullPath: string
  isTabbar?: boolean
  query?: PageQuery
  method?: string
  methodType?: string
  methodName?: string
}
