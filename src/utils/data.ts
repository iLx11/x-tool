/********************************************************************************
 * @brief: 字节序枚举（大端/小端）
 * @return {*}
 ********************************************************************************/
export const Endianness = {
  LITTLE: 'little', // 小端（低字节在前）
  BIG: 'big', // 大端（高字节在前）
}

export type Endianness = (typeof Endianness)[keyof typeof Endianness]

/********************************************************************************
 * @brief: 将数字转换为指定字节序的字节数组
 * @param {number} number 待转换的数字（自动截断为无符号整数）
 * @param {number} byteCount 目标字节长度（必须为正整数）
 * @param {Endianness} endian 字节序（默认小端）
 * @return {*} 字节数组（每个元素为 0-255 的整数）
 ********************************************************************************/
export const numToBytes = (
  number: number,
  byteCount: number,
  endian: Endianness = Endianness.BIG,
): number[] => {
  if (!Number.isInteger(byteCount) || byteCount <= 0) {
    throw new Error('Byte count must be a positive integer.')
  }

  const unsignedNum = number >>> 0 // 转为无符号整数
  const byteArray: number[] = new Array(byteCount)

  for (let i = 0; i < byteCount; i++) {
    // 根据字节序计算位移：小端用 i*8，大端用 (byteCount-1 - i)*8
    const shift = endian === Endianness.LITTLE ? i * 8 : (byteCount - 1 - i) * 8
    byteArray[i] = (unsignedNum >> shift) & 0xff
  }

  return byteArray
}

/********************************************************************************
 * @brief: 将任意长度的字节数组转换为数字（支持不同字节序）
 * @param {number[]} bytes 字节数组
 * @param {Endianness} endian 字节序（默认小端）
 * @return {*} 转换后的数字
 ********************************************************************************/
export const bytesToNum = (
  bytes: number[],
  endian: Endianness = Endianness.BIG,
): number => {
  let result = 0

  if (endian === Endianness.LITTLE) {
    // 小端：从低位到高位
    for (let i = 0; i < bytes.length; i++) {
      // 根据字节序计算位移：小端用 i*8，大端用 (byteCount-1 - i)*8
      result |= (bytes[i] & 0xff) << (i * 8)
    }
  } else {
    // 大端：从高位到低位
    for (let i = 0; i < bytes.length; i++) {
      result |= (bytes[i] & 0xff) << ((bytes.length - 1 - i) * 8)
    }
  }

  return result
}

/********************************************************************************
 * @brief: 将数字转换为16位无符号整数的指定字节序字节数组（固定2字节）
 * @param {number} number 待转换的数字（自动截断为16位无符号整数范围）
 * @param {Endianness} endian 字节序（默认小端）
 * @return {*} 长度为2的字节数组
 ********************************************************************************/
export const numToBits16 = (
  number: number,
  endian: Endianness = Endianness.BIG,
): [number, number] => {
  const uint16 = number & 0xffff // 截断为16位无符号整数

  if (endian === Endianness.LITTLE) {
    return [uint16 & 0xff, (uint16 >> 8) & 0xff] // 小端：[低8位, 高8位]
  } else {
    return [(uint16 >> 8) & 0xff, uint16 & 0xff] // 大端：[高8位, 低8位]
  }
}

/********************************************************************************
 * @brief: 将16位字节数组转换为数字（与numTo16Bits相反功能）
 * @param {[number, number]} bytes 长度为2的字节数组
 * @param {Endianness} endian 字节序（默认小端）
 * @return {*} 转换后的数字
 ********************************************************************************/
export const bits16ToNum = (
  bytes: [number, number],
  endian: Endianness = Endianness.BIG,
): number => {
  if (bytes.length !== 2) {
    throw new Error('Input array must have exactly 2 elements')
  }

  if (endian === Endianness.LITTLE) {
    // 小端：[低8位, 高8位]
    return (bytes[1] << 8) | bytes[0]
  } else {
    // 大端：[高8位, 低8位]
    return (bytes[0] << 8) | bytes[1]
  }
}

/********************************************************************************
 * @brief: 将数字转换为ASCII码值数组（每个数字转换为其对应的ASCII码）
 * @param {number} n 待转换的数字（自动取绝对值）
 * @return {*} ASCII码值数组（每个元素为0-255的整数）
 ********************************************************************************/
export const numToAsciiArr = (n: number): number[] => {
  return Math.abs(n) // 去符号
    .toString() // 变成 "12345"
    .split('') // ["1","2","3","4","5"]
    .map(c => c.charCodeAt(0)) // [49,50,51,52,53]
}

/********************************************************************************
 * @brief: 将ASCII码值数组转换为对应的数字
 * @param {number[]} ascii
 * @return {*}
 ********************************************************************************/
export const asciiArrToNum = (ascii: number[]): number => {
  return Number(String.fromCharCode(...ascii))
}
