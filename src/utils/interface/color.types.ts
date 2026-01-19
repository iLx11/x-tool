// 解析后的RGB颜色
export interface ParsedRGB {
  type: 'rgb'
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

// 解析后的RGBA颜色
export interface ParsedRGBA {
  type: 'rgba'
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
  a: number // 0-1
}

// 解析后的HSV颜色
export interface ParsedHSV {
  type: 'hsv'
  h: number // 0-360
  s: number // 0-1（饱和度）
  v: number // 0-1（明度）
}

// 解析后的HSL颜色
export interface ParsedHSL {
  type: 'hsl'
  h: number // 0-360（色相）
  s: number // 0-1（饱和度）
  l: number // 0-1（明度）
}

// 解析后的HSL颜色
export interface ParsedHSLA {
  type: 'hsla'
  h: number // 0-360（色相）
  s: number // 0-1（饱和度）
  l: number // 0-1（明度）
  a: number // 0-1（透明度）
}

// 联合类型：所有可能的解析结果
export type ParsedColor =
  | ParsedRGB
  | ParsedRGBA
  | ParsedHSV
  | ParsedHSL
  | ParsedHSLA
// Hex 颜色：带 # 的十六进制字符串（如 #ff0000 或 #f00）
export type Hex = `#${string}`
