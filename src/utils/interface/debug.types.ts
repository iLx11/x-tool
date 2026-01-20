
/**
 * @brief: 日志类型枚举（对应原生console的方法类型）
 * @desc: 限定支持的日志类型，避免非法日志调用
 */
export type ConsoleType = 'log' | 'info' | 'warn' | 'error' | 'debug'

/**
 * @brief: 日志工具配置项接口
 * @desc: 定义日志工具的核心配置参数类型
 */
export interface LoggerConfig {
  /** 是否开启调试模式（true=输出日志，false=关闭日志） */
  enable: boolean
  /** 强制保留的日志类型（即使关闭调试，这些类型仍会输出） */
  reserveTypes: ConsoleType[]
  /** 日志前缀（用于区分自定义日志和原生日志） */
  prefix: string
}
