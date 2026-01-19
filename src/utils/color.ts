import type {
  ParsedColor,
  ParsedHSL,
  ParsedHSLA,
  ParsedRGB,
  ParsedRGBA,
  ParsedHSV,
} from './interface/color.types'

/********************************************************************************
 * @brief: 限制数值在指定范围内
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {*}
 ********************************************************************************/
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/********************************************************************************
 * @brief: 解析颜色字符串（支持 rgb/rgba/hsv/hsl 格式）
 * @param {string} str 待解析的颜色字符串（如 "hsl(120, 100%, 50%)"、"hsla(240, 50%, 70%, 0.8)"）
 * @return {*} 解析后的颜色对象，不匹配任何格式时返回 null
 ********************************************************************************/
export function parseColorString(str: string): ParsedColor | null {
  /********************************************************************************
   * @brief: 工具函数：将百分比/数字转换为 0-255 的 RGB 分量
   * @param {string} valueStr
   * @return {*}
   ********************************************************************************/
  const toRgbComponent = (valueStr: string): number => {
    const isPercent = valueStr.endsWith('%')
    const value = parseFloat(valueStr.replace('%', ''))

    if (isPercent) {
      // 百分比转换（0%-100% → 0-255）
      return Math.round(clamp(value / 100, 0, 1) * 255)
    } else {
      // 直接数字（0-255）
      return clamp(Math.round(value), 0, 255)
    }
  }

  /********************************************************************************
   * @brief: 工具函数：将百分比/数字转换为 0-1 的 Alpha 分量
   * @param {string} valueStr
   * @return {*}
   ********************************************************************************/
  const toAlphaComponent = (valueStr: string): number => {
    const isPercent = valueStr.endsWith('%')
    const value = parseFloat(valueStr.replace('%', ''))

    if (isPercent) {
      return clamp(value / 100, 0, 1)
    } else {
      return clamp(value, 0, 1)
    }
  }

  /********************************************************************************
   * @brief: 工具函数：将百分比转换为 0-1 的 HSV/HSL 分量（饱和度/明度/亮度）
   * @param {string} valueStr
   * @return {*}
   ********************************************************************************/
  const toPercentComponent = (valueStr: string): number => {
    if (!valueStr.endsWith('%')) return 0 // 无效格式默认0
    const value = parseFloat(valueStr.replace('%', ''))
    return clamp(value / 100, 0, 1)
  }

  // 1. 匹配 rgb(...) 格式
  const rgbRegex =
    /^rgb\(\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)\s*\)$/i
  const rgbMatch = str.match(rgbRegex)
  if (rgbMatch) {
    const [, rStr, , gStr, , bStr] = rgbMatch
    return {
      type: 'rgb',
      r: toRgbComponent(rStr),
      g: toRgbComponent(gStr),
      b: toRgbComponent(bStr),
    }
  }

  // 2. 匹配 rgba(...) 格式
  const rgbaRegex =
    /^rgba\(\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)\s*\)$/i
  const rgbaMatch = str.match(rgbaRegex)
  if (rgbaMatch) {
    const [, rStr, , gStr, , bStr, , aStr] = rgbaMatch
    return {
      type: 'rgba',
      r: toRgbComponent(rStr),
      g: toRgbComponent(gStr),
      b: toRgbComponent(bStr),
      a: toAlphaComponent(aStr),
    }
  }

  // 3. 匹配 hsv(...) 格式
  const hsvRegex =
    /^hsv\(\s*(\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?%)\s*,\s*(\d+(\.\d+)?%)\s*\)$/i
  const hsvMatch = str.match(hsvRegex)
  if (hsvMatch) {
    const [, hStr, , sStr, , vStr] = hsvMatch
    return {
      type: 'hsv',
      h: clamp(parseFloat(hStr), 0, 360),
      s: toPercentComponent(sStr),
      v: toPercentComponent(vStr),
    }
  }

  // 4. 匹配 hsl(...) 格式（新增）
  const hslRegex =
    /^hsl\(\s*(\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?%)\s*,\s*(\d+(\.\d+)?%)\s*\)$/i
  const hslMatch = str.match(hslRegex)
  if (hslMatch) {
    const [, hStr, , sStr, , lStr] = hslMatch
    return {
      type: 'hsl',
      h: clamp(parseFloat(hStr), 0, 360), // 色相 0-360
      s: toPercentComponent(sStr), // 饱和度 0-1
      l: toPercentComponent(lStr), // 明度 0-1
    }
  }

  // 5. 匹配 hsla(...) 格式（带透明度，新增）
  const hslaRegex =
    /^hsla\(\s*(\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?%)\s*,\s*(\d+(\.\d+)?%)\s*,\s*(\d+(\.\d+)?%?)\s*\)$/i
  const hslaMatch = str.match(hslaRegex)
  if (hslaMatch) {
    const [, hStr, , sStr, , lStr, , aStr] = hslaMatch
    return {
      type: 'hsla',
      h: clamp(parseFloat(hStr), 0, 360),
      s: toPercentComponent(sStr),
      l: toPercentComponent(lStr),
      a: toAlphaComponent(aStr), // 透明度 0-1
    }
  }

  // 不匹配任何格式
  return null
}

/********************************************************************************
 * @brief: HSL 转 RGB 颜色转换
 * @param {ParsedColor} hsl HSL 颜色对象（分量范围 0-255）
 * @return {*} RGB 颜色对象（分量范围 0-255）
 ********************************************************************************/
export function hslToRgb(
  hsl: ParsedHSL | ParsedHSLA | null,
): ParsedColor | null {
  // 输入边界处理
  const h = clamp(hsl.h, 0, 360) / 360 // 归一化色相到 0-1
  const s = clamp(hsl.s, 0, 1)
  const l = clamp(hsl.l, 0, 1)

  let r = 0,
    g = 0,
    b = 0

  if (s === 0) {
    // 无饱和度（灰度）
    r = g = b = l
  } else {
    // 辅助函数：计算颜色分量
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  // 转换为 0-255 范围并取整
  return {
    type: 'rgb',
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/********************************************************************************
 * @brief: RGB 转 HSL 颜色转换
 * @param {ParsedColor} rgb RGB 颜色对象（分量范围 0-255）
 * @return {*} HSL 颜色对象（h:0-360, s:0-1, l:0-1）
 ********************************************************************************/
export function rgbToHsl(
  rgb: ParsedRGB | ParsedRGBA | null,
): ParsedColor | null {
  // 1. 输入处理：将 RGB 分量归一化到 0-1 范围
  const r = clamp(rgb.r, 0, 255) / 255
  const g = clamp(rgb.g, 0, 255) / 255
  const b = clamp(rgb.b, 0, 255) / 255

  // 2. 计算最大/最小分量值
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min // 颜色范围（用于计算饱和度）

  // 3. 计算明度（Lightness）
  const l = (max + min) / 2

  // 4. 计算饱和度（Saturation）
  let s = 0
  if (delta !== 0) {
    // 饱和度公式：根据明度调整计算方式
    s = delta / (1 - Math.abs(2 * l - 1))
  }

  // 5. 计算色相（Hue）
  let h = 0
  if (delta !== 0) {
    switch (max) {
      case r:
        // 红色为最大分量时，色相基于 g - b 计算
        h = ((g - b) / delta) % 6
        break
      case g:
        // 绿色为最大分量时，色相基于 b - r 计算
        h = (b - r) / delta + 2
        break
      case b:
        // 蓝色为最大分量时，色相基于 r - g 计算
        h = (r - g) / delta + 4
        break
    }
    // 转换为 0-360 度（若为负数则加 360 确保在正数范围）
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  // 6. 输出处理：确保饱和度和明度在 0-1 范围内
  return {
    type: 'hsl',
    h: clamp(h, 0, 360),
    s: clamp(s, 0, 1),
    l: clamp(l, 0, 1),
  }
}

/********************************************************************************
 * @brief: HSV 转 HSL 颜色转换
 * @param {ParsedColor} hsv HSV 颜色对象（分量范围 0-255）
 * @return {*} HSL 颜色对象（h:0-360, s:0-1, l:0-1）
 ********************************************************************************/
export function hsvToHsl(hsv: ParsedHSV): ParsedColor {
  const { h, s: sHsv, v } = hsv

  // 计算HSL的亮度(L)
  let l: number
  if (sHsv === 0) {
    // 饱和度为0时，亮度等于明度（灰度）
    l = v
  } else {
    l = ((2 - sHsv) * v) / 2
  }
  // 确保亮度在0-1范围内
  l = Math.max(0, Math.min(1, l))

  // 计算HSL的饱和度(S)
  let s: number
  if (l === 0 || l === 1) {
    // 纯黑或纯白时饱和度为0
    s = 0
  } else {
    s = (sHsv * v) / (1 - Math.abs(2 * l - 1))
    // 确保饱和度在0-1范围内
    s = Math.max(0, Math.min(1, s))
  }

  return {
    type: 'hsl',
    h: Math.max(0, Math.min(360, h)), // 确保色相在0-360范围内
    s,
    l,
  }
}

/********************************************************************************
 * @brief: HSL 转 HSV 颜色转换
 * @param {ParsedColor} hsl HSL 颜色对象（分量范围 0-255）
 * @return {*} HSV 颜色对象（h:0-360, s:0-1, v:0-1）
 ********************************************************************************/
export function hslToHsv(hsl: ParsedHSL): ParsedColor {
  const { h, s: sHsl, l } = hsl

  // 计算HSV的明度(V)
  const v = l + sHsl * Math.min(l, 1 - l)
  // 确保明度在0-1范围内
  const clampedV = Math.max(0, Math.min(1, v))

  // 计算HSV的饱和度(S)
  let s: number
  if (clampedV === 0) {
    // 明度为0时饱和度为0（纯黑）
    s = 0
  } else {
    s = 2 * (1 - l / clampedV)
    // 确保饱和度在0-1范围内
    s = Math.max(0, Math.min(1, s))
  }

  return {
    type: 'hsv',
    h: Math.max(0, Math.min(360, h)), // 确保色相在0-360范围内
    s,
    v: clampedV,
  }
}
