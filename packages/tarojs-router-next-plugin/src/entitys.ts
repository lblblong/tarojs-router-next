export class Page {
  dirName: string
  dirPath: string
  path: string
  fullPath: string
  packageName: string
  routeConfig?: RouteConfig
  method?: PageMethod
}

export class PageMethod {
  name: string
  type: string
  value: string
}

export class RouteConfig {
  params?: string
  data?: string
  ext?: string
}

export class ConfigPage {
  packageName: string
  packageRoot: string
  path: string
  fullPath: string
}
