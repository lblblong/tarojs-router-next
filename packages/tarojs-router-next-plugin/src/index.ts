import { IPluginContext } from '@tarojs/service'
import { InjectRouterEmiter } from './inject-router-emiter'
import { RouterCodeGenerator } from './router-code-generator'

export default (ctx: IPluginContext, config: any) => {
  new RouterCodeGenerator(ctx, config).listenBuildStart().registerCommand()
  new InjectRouterEmiter(ctx, config)
}
