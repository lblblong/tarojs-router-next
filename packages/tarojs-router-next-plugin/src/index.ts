import { IPluginContext } from '@tarojs/service'
import { Plugin } from './plugin'

export default (ctx: IPluginContext, config: any) => {
  new Plugin(ctx, config).onBuildStart().registerCommand()
}
