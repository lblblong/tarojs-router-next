# 路由配置

每一个页面都可以通过文件夹下的 `route.config.ts` 文件：

- 定义进入该页面的 `Router.to**` 方法的参数 (`params`)、数据 (`data`) 的类型
- 定义提供给路由中间件的 [附加数据](/guide/quike/middleware#路由附加数据)

通过 `route.config.ts` 导出类型定义后，可让 `Router.to**` 方法获得完备的类型提示

## route.config.ts

该文件添加在页面文件夹下，比如原文件夹结构：

- src/pages/index
  - index.config.ts
  - index.css
  - index.tsx

增加 route.config.ts 后：

- src/pages/index
  - index.config.ts
  - index.css
  - index.tsx
  - `route.config.ts`

## 定义进入该页面需要传入的 params 参数的类型

在 `route.config.ts` 中导出类型定义 `Params`

由于 params 会展开附加到 url 后面，请不要定义层级一层以上的类型

```typescript
export type Params = {
  id: number
  title: string
}
```

## 定义进入该页面需要传入的 data 数据的类型

在 `route.config.ts` 中导出类型定义 `Data`

```typescript
export type Data = {
  users: {
    id: number
    name: string
    sex: 'boy' | 'girl'
  }[]
}
```

## 导出附加数据 Ext

附加数据是传递给中间件使用的

```typescript
export const Ext = {
  mustLogin: true,
  role: [1, 2, 3],
}
```
