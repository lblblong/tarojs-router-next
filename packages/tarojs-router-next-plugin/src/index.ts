import { IPluginContext } from '@tarojs/service'
import { RouterCodeGenerator } from './router-code-generator'

export default (ctx: IPluginContext, config: any) => {
  new RouterCodeGenerator(ctx, config).listenBuildStart().registerCommand()
}
