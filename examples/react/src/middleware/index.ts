import { registerMiddlewares } from 'tarojs-router-next'
import { AuthCheck } from './auth-check'
import { FetchInfo } from './fetch-info'

registerMiddlewares([AuthCheck, FetchInfo])
