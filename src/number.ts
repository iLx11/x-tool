/**
 * 数字工具函数
 */

/**
 * 生成范围内随机数
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 数字格式化（千分位）
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 限制数字在范围内
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 数字补零
 */
export function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0');
}

/**
 * 判断是否为数字
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}