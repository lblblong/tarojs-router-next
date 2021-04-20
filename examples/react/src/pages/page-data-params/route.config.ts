export type Params = {
  id: number
  name?: string
}

export type Data = {
  users: {
    id: number
    name: string
    sex: 'boy' | 'girl'
  }[]
}
