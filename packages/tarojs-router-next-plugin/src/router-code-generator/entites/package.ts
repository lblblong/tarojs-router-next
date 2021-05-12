import { Page } from './page'

export class PackageConfig {
  name: 'main' | string
  root: string
  pagesPath: string
  fullPagesPath: string
  pageConfigs: PackagePageConfig[]
  pages: Page[] = []
  methods: string
}

export class PackagePageConfig {
  origin: string
  dir: string
  fullPath: string
  isTabbar?: boolean
}
