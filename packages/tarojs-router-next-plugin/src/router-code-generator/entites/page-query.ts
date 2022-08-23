export class QueryMeta {
  text: string
  name: string
}

export class PageQuery {
  params?: QueryMeta
  data?: QueryMeta
  ext?: string
}
