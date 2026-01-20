/********************************************************************************
 * @file: logger.ts
 * @brief: 可开关的Console日志工具函数封装（兼容CJS/ESM双环境）
 * @desc: 支持开发/生产环境自动切换日志输出，可保留关键错误日志，支持动态配置开关
 * @note: 移除import.meta依赖，兼容CommonJS/ESModule双模块格式
 ********************************************************************************/
import type { ConsoleType, LoggerConfig } from './interface/debug.types'

declare global {
  /**
   * @brief: 扩展Window接口，添加自定义环境变量属性__ENV__
   * @desc: 解决TS2339错误：Property '__ENV__' does not exist on type 'Window'
   */
  interface Window {
    __ENV__?: {
      MODE: 'development' | 'production' | string // 环境模式（开发/生产）
    }
  }
}

// ===================== 环境判断（兼容CJS/ESM双环境） =====================
/**
 * @brief: 判断当前是否为浏览器环境
 * @return {boolean} true=浏览器环境，false=Node.js环境
 */
const isBrowser = typeof window !== 'undefined'

/********************************************************************************
 * @brief: 判断当前是否为开发环境（兼容CJS/ESM）
 * @desc: 优先读取process.env（CJS），兜底读取window环境变量（浏览器ESM）
 * @return {boolean} true=开发环境，false=生产环境
 ********************************************************************************/
const isDevelopmentEnv = (): boolean => {
  // 1. Node.js/CJS环境：读取process.env（Webpack/Node/TSC编译后）
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV === 'development'
  }

  // 2. 浏览器ESM环境（无process）：读取window上的环境变量（需构建工具注入）
  if (isBrowser && window.__ENV__?.MODE) {
    return window.__ENV__.MODE === 'development'
  }

  // 3. 兜底逻辑：未检测到环境变量时，默认视为开发环境
  return true
}

// ===================== 核心配置 =====================
/**
 * @brief: 日志工具默认配置
 * @desc: 开发环境开启所有日志，生产环境仅保留error类型日志
 */
const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  enable: isDevelopmentEnv(),
  reserveTypes: ['error'],
  prefix: '[iLx1-tool]',
}

// 全局配置（支持动态修改）
let loggerConfig: LoggerConfig = { ...DEFAULT_LOGGER_CONFIG }

// ===================== 辅助函数 =====================
/********************************************************************************
 * @brief: 判断指定类型的日志是否允许输出
 * @param {ConsoleType} type 日志类型（log/info/warn/error/debug）
 * @return {boolean} true=允许输出，false=禁止输出
 ********************************************************************************/
const isLogEnabled = (type: ConsoleType): boolean => {
  // 开启调试模式 → 允许所有类型输出
  if (loggerConfig.enable) {
    return true
  }
  // 关闭调试模式 → 仅允许保留类型输出
  return loggerConfig.reserveTypes.includes(type)
}

// ===================== 核心日志函数封装 =====================
/********************************************************************************
 * @brief: 封装console.log方法（可开关控制）
 * @param {any[]} args 日志打印参数（任意数量、任意类型）
 * @return {void} 无返回值
 ********************************************************************************/
export const log = (...args: any[]): void => {
  if (isLogEnabled('log')) {
    console.log(`${loggerConfig.prefix} [LOG]`, ...args)
  }
}

/********************************************************************************
 * @brief: 封装console.info方法（可开关控制）
 * @param {any[]} args 日志打印参数（任意数量、任意类型）
 * @return {void} 无返回值
 ********************************************************************************/
export const info = (...args: any[]): void => {
  if (isLogEnabled('info')) {
    console.info(`${loggerConfig.prefix} [INFO]`, ...args)
  }
}

/********************************************************************************
 * @brief: 封装console.warn方法（可开关控制）
 * @param {any[]} args 日志打印参数（任意数量、任意类型）
 * @return {void} 无返回值
 ********************************************************************************/
export const warn = (...args: any[]): void => {
  if (isLogEnabled('warn')) {
    console.warn(`${loggerConfig.prefix} [WARN]`, ...args)
  }
}

/********************************************************************************
 * @brief: 封装console.error方法（可开关控制，默认生产环境保留）
 * @param {any[]} args 日志打印参数（任意数量、任意类型）
 * @return {void} 无返回值
 ********************************************************************************/
export const error = (...args: any[]): void => {
  if (isLogEnabled('error')) {
    console.error(`${loggerConfig.prefix} [ERROR]`, ...args)
  }
}

/********************************************************************************
 * @brief: 封装console.debug方法（可开关控制）
 * @param {any[]} args 日志打印参数（任意数量、任意类型）
 * @return {void} 无返回值
 ********************************************************************************/
export const debug = (...args: any[]): void => {
  if (isLogEnabled('debug')) {
    console.debug(`${loggerConfig.prefix} [DEBUG]`, ...args)
  }
}

// ===================== 配置控制函数 =====================
/********************************************************************************
 * @brief: 动态修改日志工具配置
 * @param {Partial<LoggerConfig>} config 要修改的配置项（可选，无需传全部）
 * @return {void} 无返回值
 * @example:
 * setLoggerConfig({ enable: false }); // 全局关闭所有日志
 * setLoggerConfig({ reserveTypes: ['error', 'warn'] }); // 保留错误和警告日志
 ********************************************************************************/
export const setLoggerConfig = (config: Partial<LoggerConfig>): void => {
  loggerConfig = { ...loggerConfig, ...config }
}

/********************************************************************************
 * @brief: 重置日志工具配置为默认值
 * @return {void} 无返回值
 ********************************************************************************/
export const resetLoggerConfig = (): void => {
  loggerConfig = { ...DEFAULT_LOGGER_CONFIG }
}

/********************************************************************************
 * @brief: 强制开启所有日志（临时调试用）
 * @return {void} 无返回值
 ********************************************************************************/
export const enableAllLogs = (): void => {
  setLoggerConfig({
    enable: true,
    reserveTypes: ['log', 'info', 'warn', 'error', 'debug'],
  })
}

/********************************************************************************
 * @brief: 强制关闭所有日志（紧急生产环境用）
 * @return {void} 无返回值
 ********************************************************************************/
export const disableAllLogs = (): void => {
  setLoggerConfig({ enable: false, reserveTypes: [] })
}
