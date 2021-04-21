export class NoPageException extends Error {
  constructor() {
    super('没有页面可以回退了')
  }
}
