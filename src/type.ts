/**
 * 类型判断工具函数
 */

/**
 * 判断是否为数组
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * 判断是否为对象
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !isArray(value);
}

/**
 * 判断是否为函数
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * 判断是否为字符串
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * 判断是否为数字
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 判断是否为布尔值
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 判断是否为 null 或 undefined
 */
export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}