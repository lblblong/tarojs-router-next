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
  backData?: string
  ext?: string
}

export class ConfigPage {
  packageRoot: string
  path: string
  fullPath: string
}
