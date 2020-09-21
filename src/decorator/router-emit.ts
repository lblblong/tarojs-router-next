import { Router } from "../router"


/**
 * Class 页面组件支持
 */
export function RouterEmit(target: any) {
  const originComponentWillUnmount = target.prototype.componentWillUnmount
  target.prototype.componentWillUnmount = () => {
    originComponentWillUnmount && originComponentWillUnmount()
    Router.emitBack()
  }

  return target
}