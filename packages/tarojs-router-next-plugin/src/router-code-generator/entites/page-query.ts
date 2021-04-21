export class QueryMeta {
  text: string
  optional: boolean
  name: string
}

export class PageQuery {
  params?: QueryMeta
  data?: QueryMeta
  ext?: string
}
