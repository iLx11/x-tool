import type { Result } from './interface/result.types'

/********************************************************************************
 * @brief: 创建成功的结果对象
 * @param {T} data 业务数据（可选，默认 null）
 * @param {string} message 成功信息（可选，默认空字符串）
 * @param {number} code 成功状态码（可选，默认 0）
 * @return {*} 成功的 Result 对象
 ********************************************************************************/
export function successResult<T = unknown>(
  data: T = null as unknown as T,
  message: string = '',
  code: number = 0,
): Result<T> {
  return {
    success: true,
    code,
    message,
    data,
  }
}

/********************************************************************************
 * @brief: 创建失败的结果对象
 * @param {string} message 错误信息（必选）
 * @param {number} code 错误码（可选，默认 -1）
 * @param {T} data 错误相关数据（可选，默认 null）
 * @return {*} 失败的 Result 对象
 ********************************************************************************/
export function errorResult<T = unknown>(
  message: string,
  code: number = -1,
  data: T = null as unknown as T,
): Result<T> {
  return {
    success: false,
    code,
    message,
    data,
  }
}
