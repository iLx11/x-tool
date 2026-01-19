import { gzipSync, gunzipSync } from 'fflate'

/********************************************************************************
 * @brief: gzip 压缩 JSON 数据（转成 Blob，适合导出）
 * @param {any} data
 * @return {*}
 ********************************************************************************/
export const compressJsonGzip = (data: any): Blob => {
  // 1. 紧凑 JSON
  const jsonStr = JSON.stringify(data)
  // 2. 转 Uint8Array
  const uint8Array = new TextEncoder().encode(jsonStr)
  // 关键：显式转成 Uint8Array<ArrayBuffer>
  const compressedArray = new Uint8Array(gzipSync(uint8Array))
  // 4. 转 Blob
  return new Blob([compressedArray], { type: 'application/gzip' })
}

/********************************************************************************
 * @brief: 解压 gzip 格式的 JSON 文件
 * @param {File} file
 * @return {*}
 ********************************************************************************/
export const decompressJsonGzip = async (file: File): Promise<any> => {
  // 1. 读取文件
  const arrayBuffer = await file.arrayBuffer()
  // 2. gzip 解压（同步）
  const decompressedArray = gunzipSync(new Uint8Array(arrayBuffer))
  // 3. 转字符串并解析 JSON
  const jsonStr = new TextDecoder().decode(decompressedArray)
  return JSON.parse(jsonStr)
}
