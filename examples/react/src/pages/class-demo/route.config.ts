export type Params = {
  id: number
  sex?: 'boy' | 'girl'
  name?: string
}

export type Data = {
  users: {
    id: number
    name: string
    sex: 'boy' | 'girl'
  }[]
}

