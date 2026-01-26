import Konva from 'konva'

/********************************************************************************
 * @brief: 图像数据处理配置接口
 ********************************************************************************/
export interface IConfig {
  // 0：反转数值
  reverseValue: number
  // 1：取模方式 （0：逐行，1：逐列，2：列行，3：行列）
  modMode: number
  // 2：反转位序
  reverseBit: number
  // 3：输出模式（0：十六进制数组，1：字节数组）
  outputMode: number
}

/********************************************************************************
 * @brief: 图像处理工具函数库主对象
 ********************************************************************************/
export const ImageToHexArray = {
  /********************************************************************************
   * @brief: 生成十六进制数组
   * @param {string} picData - base64图像数据
   * @param {number} thresholdData - 阈值
   * @param {Array} config - 配置数组
   * @return {Promise<Array|Uint8Array>} 十六进制数组
   ********************************************************************************/
  generate: async function (
    picData: string,
    thresholdData: number,
    config: number[]
  ): Promise<Uint8Array> {
    try {
      const picImageData = await this.base64ToImageData(picData)
      const bufferData = this.imageDataToHexArray(
        picImageData,
        thresholdData,
        config
      )

      return config[3] === 0
        ? this.hex2hex(this.arrayToHex(bufferData))
        : bufferData
    } catch (error) {
      console.error('生成十六进制数组时出错:', error)
      throw error
    }
  },

  /********************************************************************************
   * @brief: ImageData 对象转 hexArray
   * @param {ImageData} imageData - 图像数据对象
   * @param {number} threshold - 阈值
   * @param {Array} config - 配置数组
   * @return {Uint8Array} 处理后的字节数组
   ********************************************************************************/
  imageDataToHexArray: function (
    imageData: ImageData,
    threshold: number,
    config: number[]
  ): Uint8Array {
    const pixels = imageData.data
    const height = imageData.height
    const width = imageData.width
    const pixelsLen = pixels.length

    // 单色图片取模
    if (config[4] == 1) {
      const unpackedBuffer = []
      const depth = 4

      for (let i = 0; i < pixelsLen; i += depth) {
        // 灰度值计算 (使用加权平均)
        const grayValue =
          pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114
        const pixelVal = grayValue > threshold ? 1 : 0
        unpackedBuffer[i / depth] = pixelVal
      }

      // 根据配置选择取模函数
      const samplingMode = config[1]
      let samplingFunction

      switch (samplingMode) {
        case 0:
          samplingFunction = this.ImageSamplingRow
          break
        case 1:
          samplingFunction = this.ImageSamplingCol
          break
        case 2:
          samplingFunction = this.ImageSamplingColRow
          break
        case 3:
          samplingFunction = this.ImageSamplingRowCol
          break
        default:
          samplingFunction = this.ImageSamplingRow
      }

      if (typeof samplingFunction !== 'function') {
        throw new Error(`取模函数未定义，samplingMode: ${samplingMode}`)
      }

      return samplingFunction.call(this, unpackedBuffer, width, height, config)
    } else {
      // 彩色图片取模
      return this.colorImageSampling(pixels, width, height, config)
    }
  },

  /********************************************************************************
   * @brief: 彩色图像取模 (RGB565格式)
   * @param {Uint8ClampedArray} pixels - 像素数组
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Array} config - 配置数组
   * @return {Uint8Array} RGB565格式的字节数组
   ********************************************************************************/
  colorImageSampling: function (
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    config: number[]
  ): Uint8Array {
    const buffer = new Uint8Array(width * height * 2)
    let i = 0,
      j = 0

    while (i < buffer.length && j < pixels.length) {
      // 提取RGB分量
      const r = pixels[j]
      const g = pixels[j + 1]
      const b = pixels[j + 2]

      // RGB565 格式转换 (5位红，6位绿，5位蓝)
      const r5 = (r >> 3) & 0x1f // 5位红色
      const g6 = (g >> 2) & 0x3f // 6位绿色
      const b5 = (b >> 3) & 0x1f // 5位蓝色

      // 组合为16位颜色: RRRRRGGGGGGBBBBB
      const color = (r5 << 11) | (g6 << 5) | b5

      // 拆分为两个字节
      buffer[i] = (color >> 8) & 0xff // 高字节
      buffer[i + 1] = color & 0xff // 低字节

      // 反转处理 (如果需要)
      if (config[0] == 0 || config[2] == 1) {
        buffer[i] = ~buffer[i] & 0xff
        buffer[i + 1] = ~buffer[i + 1] & 0xff
      }

      i += 2
      j += 4 // 跳过alpha通道
    }

    return buffer
  },

  /********************************************************************************
   * @brief: 逐行式取模 (从左到右，从上到下)
   * @param {Array} unpackedBuffer - 解压后的像素缓冲区
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Array} config - 配置数组
   * @return {Uint8Array} 取模后的字节数组
   ********************************************************************************/
  ImageSamplingRow: function (
    unpackedBuffer: number[],
    width: number,
    height: number,
    config: number[]
  ): Uint8Array {
    const bytesPerRow = Math.ceil(width / 8)
    const buffer = new Uint8Array(bytesPerRow * height)

    for (let i = 0; i < unpackedBuffer.length; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // 确定取模的 page (每行是一个page)
      const page = y

      // 确定位偏移
      const bitOffset = x % 8
      let pageShift = 1 << bitOffset

      // 反转位序 (如果需要)
      if (config[2] != 0) {
        pageShift = 1 << (7 - bitOffset)
      }

      // 计算字节位置
      const bytePos = page * bytesPerRow + Math.floor(x / 8)

      // 像素值处理 (反转颜色如果需要)
      let pixelVal = unpackedBuffer[i]
      if (config[0] !== 0) {
        pixelVal = pixelVal === 0 ? 1 : 0
      }

      // 设置位
      if (pixelVal === 0) {
        buffer[bytePos] |= pageShift
      } else {
        buffer[bytePos] &= ~pageShift
      }
    }

    return buffer
  },

  /********************************************************************************
   * @brief: 逐列式取模 (从上到下，从左到右)
   * @param {Array} unpackedBuffer - 解压后的像素缓冲区
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Array} config - 配置数组
   * @return {Uint8Array} 取模后的字节数组
   ********************************************************************************/
  ImageSamplingCol: function (
    unpackedBuffer: number[],
    width: number,
    height: number,
    config: number[]
  ): Uint8Array {
    const bytesPerCol = Math.ceil(height / 8)
    const buffer = new Uint8Array(bytesPerCol * width)

    for (let i = 0; i < unpackedBuffer.length; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // 确定取模的 page (每列是一个page)
      const page = x

      // 确定位偏移
      const bitOffset = y % 8
      let pageShift = 1 << bitOffset

      // 反转位序 (如果需要)
      if (config[2] != 0) {
        pageShift = 1 << (7 - bitOffset)
      }

      // 计算字节位置
      const bytePos = page * bytesPerCol + Math.floor(y / 8)

      // 像素值处理 (反转颜色如果需要)
      let pixelVal = unpackedBuffer[i]
      if (config[0] !== 0) {
        pixelVal = pixelVal === 0 ? 1 : 0
      }

      // 设置位
      if (pixelVal === 0) {
        buffer[bytePos] |= pageShift
      } else {
        buffer[bytePos] &= ~pageShift
      }
    }

    return buffer
  },

  /********************************************************************************
   * @brief: 列行式取模 (先列后行)
   * @param {Array} unpackedBuffer - 解压后的像素缓冲区
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Array} config - 配置数组
   * @return {Uint8Array} 取模后的字节数组
   ********************************************************************************/
  ImageSamplingColRow: function (
    unpackedBuffer: number[],
    width: number,
    height: number,
    config: number[]
  ): Uint8Array {
    const bytesPerCol = Math.ceil(height / 8)
    const buffer = new Uint8Array(bytesPerCol * width)

    for (let i = 0; i < unpackedBuffer.length; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // 确定取模的 page (每8行是一个page)
      const page = Math.floor(y / 8)

      // 确定位偏移
      const bitOffset = y % 8
      let pageShift = 1 << bitOffset

      // 反转位序 (如果需要)
      if (config[2] != 0) {
        pageShift = 1 << (7 - bitOffset)
      }

      // 计算字节位置
      const bytePos = x + page * width

      // 像素值处理 (反转颜色如果需要)
      let pixelVal = unpackedBuffer[i]
      if (config[0] !== 0) {
        pixelVal = pixelVal === 0 ? 1 : 0
      }

      // 设置位
      if (pixelVal === 0) {
        buffer[bytePos] |= pageShift
      } else {
        buffer[bytePos] &= ~pageShift
      }
    }

    return buffer
  },

  /********************************************************************************
   * @brief: 行列式取模 (先行后列)
   * @param {Array} unpackedBuffer - 解压后的像素缓冲区
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Array} config - 配置数组
   * @return {Uint8Array} 取模后的字节数组
   ********************************************************************************/
  ImageSamplingRowCol: function (
    unpackedBuffer: number[],
    width: number,
    height: number,
    config: number[]
  ): Uint8Array {
    const bytesPerRow = Math.ceil(width / 8)
    const buffer = new Uint8Array(bytesPerRow * height)

    for (let i = 0; i < unpackedBuffer.length; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // 确定取模的 page (每8列是一个page)
      const page = Math.floor(x / 8)

      // 确定位偏移
      const bitOffset = x % 8
      let pageShift = 1 << bitOffset

      // 反转位序 (如果需要)
      if (config[2] != 0) {
        pageShift = 1 << (7 - bitOffset)
      }

      // 计算字节位置
      const bytePos = page * height + y

      // 像素值处理 (反转颜色如果需要)
      let pixelVal = unpackedBuffer[i]
      if (config[0] !== 0) {
        pixelVal = pixelVal === 0 ? 1 : 0
      }

      // 设置位
      if (pixelVal === 0) {
        buffer[bytePos] |= pageShift
      } else {
        buffer[bytePos] &= ~pageShift
      }
    }

    return buffer
  },

  /********************************************************************************
   * @brief: base64 转 ImageData 对象
   * @param {string} base64Data - base64编码的图像数据
   * @return {Promise<ImageData>} ImageData对象
   ********************************************************************************/
  base64ToImageData: function (base64Data: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = base64Data

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          resolve(imageData)
        } catch (error) {
          reject(new Error(`转换图像数据失败: ${error.message}`))
        }
      }

      img.onerror = () => {
        reject(new Error('加载图像失败'))
      }

      img.src = base64Data
    })
  },

  /********************************************************************************
   * @brief: 使用 Konva.js 缩放图像
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度
   * @param {HTMLImageElement} image - 源图像对象
   * @param {boolean} colorMode - 是否转换为灰度
   * @return {Promise<string>} base64编码的缩放后图像
   ********************************************************************************/
  resizeImageWithKonva: async function (
    width: number,
    height: number,
    image: HTMLImageElement,
    colorMode: boolean
  ): Promise<string> {
    if (width === 0 || height === 0) {
      throw new Error('宽度和高度不能为0')
    }

    if (!image) {
      throw new Error('图像对象不能为空')
    }

    return new Promise(resolve => {
      // 检查 Konva 是否可用
      if (typeof Konva === 'undefined') {
        // 如果 Konva 不可用，使用 Canvas API 替代
        this.resizeImageWithCanvas(width, height, image, colorMode)
          .then(resolve)
          .catch(() => {
            // 如果 Canvas 也失败，返回原始图像
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          })
        return
      }

      // 创建临时舞台
      const tempStage = new Konva.Stage({
        container: document.createElement('div'),
        width: width,
        height: height,
      })

      const tempLayer = new Konva.Layer()
      tempStage.add(tempLayer)

      // 创建图像节点
      const imageNode = new Konva.Image({
        image: image,
        width: width,
        height: height,
      })

      // 应用灰度滤镜（如果需要）
      if (colorMode) {
        imageNode.filters([Konva.Filters.Grayscale])
      }

      tempLayer.add(imageNode)
      tempLayer.batchDraw()

      // 获取 base64 数据
      const dataURL = tempStage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 1,
      })

      // 销毁临时舞台
      tempStage.destroy()

      resolve(dataURL)
    })
  },

  /********************************************************************************
   * @brief: 使用 Canvas API 缩放图像 (Konva不可用时的备选方案)
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度
   * @param {HTMLImageElement} image - 源图像对象
   * @param {boolean} colorMode - 是否转换为灰度
   * @return {Promise<string>} base64编码的缩放后图像
   ********************************************************************************/
  resizeImageWithCanvas: async function (width, height, image, colorMode) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')

      // 设置高质量缩放
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 绘制并缩放图像
      ctx.drawImage(image, 0, 0, width, height)

      // 灰度处理（如果需要）
      if (colorMode) {
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          // 计算灰度值
          const gray =
            data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          data[i] = data[i + 1] = data[i + 2] = gray
        }

        ctx.putImageData(imageData, 0, 0)
      }

      // 转换为base64
      const base64 = canvas.toDataURL('image/png')
      resolve(base64)
    })
  },

  /********************************************************************************
   * @brief: Uint8Array 转十六进制字符串
   * @param {Uint8Array} array - 字节数组
   * @return {string} 十六进制字符串
   ********************************************************************************/
  arrayToHex: function (array) {
    if (!array || array.length === 0) {
      return ''
    }

    return Array.from(array)
      .map(b => Number(b).toString(16).padStart(2, '0'))
      .join('')
  },

  /********************************************************************************
   * @brief: 十六进制数据加 '0x' 前缀
   * @param {string} hex - 十六进制字符串
   * @return {Array<string>} 带0x前缀的十六进制数组
   ********************************************************************************/
  hex2hex: function (hex: string): Array<string> {
    if (!hex || hex.length === 0) {
      return []
    }

    const bytes = []
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push('0x' + hex.substring(c, c + 2))
    }
    return bytes
  },

  /********************************************************************************
   * @brief: 生成取模预览 (0=白点, 1=黑点)
   * @param {Uint8Array} unpackedBuffer - 解压后的像素缓冲区
   * @param {number} width - 图像宽度
   * @return {string} 预览字符串
   ********************************************************************************/
  generatePreview: function (
    unpackedBuffer: Uint8Array,
    width: number
  ): string {
    if (!unpackedBuffer || unpackedBuffer.length === 0) {
      return ''
    }

    let preview = ''
    for (let i = 0; i < unpackedBuffer.length; i++) {
      preview += unpackedBuffer[i] === 0 ? '0' : '1'
      if ((i + 1) % width === 0) {
        preview += '\n'
      }
    }
    return preview
  },

  /********************************************************************************
   * @brief: 创建图像数据对象（兼容性函数）
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Uint8ClampedArray} data - 像素数据
   * @return {ImageData} ImageData对象
   ********************************************************************************/
  createImageData: function (
    width: number,
    height: number,
    data: Uint8ClampedArray = null
  ) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (data) {
      const imageData = ctx.createImageData(width, height)
      imageData.data.set(data)
      return imageData
    } else {
      return ctx.createImageData(width, height)
    }
  },

  /********************************************************************************
   * @brief: 将字节数组格式化为可读字符串
   * @param {Uint8Array|Array} hexArray - 十六进制数组
   * @param {number} format - 输出格式 (0=带0x前缀, 1=原始数组)
   * @param {number} lineBreak - 每行显示的字节数
   * @return {string} 格式化后的字符串
   ********************************************************************************/
  formatHexOutput: function (
    hexArray: Uint8Array | Array<string>,
    format = 0,
    lineBreak = 16
  ): string {
    if (!hexArray || hexArray.length === 0) {
      return '无数据'
    }

    let outputText = ''

    if (format === 0 && Array.isArray(hexArray)) {
      // 带0x前缀的格式
      for (let i = 0; i < hexArray.length; i++) {
        outputText += hexArray[i] + ', '
        if ((i + 1) % lineBreak === 0) {
          outputText += '\n'
        }
      }
    } else if (hexArray instanceof Uint8Array) {
      // 原始数组格式
      for (let i = 0; i < hexArray.length; i++) {
        outputText += hexArray[i].toString(16).padStart(2, '0') + ' '
        if ((i + 1) % lineBreak === 0) {
          outputText += '\n'
        }
      }
    } else {
      // 其他格式直接转换为字符串
      outputText = hexArray.toString()
    }

    return outputText
  },

  /********************************************************************************
   * @brief: 计算输出字节数
   * @param {Uint8Array|Array} hexArray - 十六进制数组
   * @return {Object} 包含字节数和KB数的对象
   ********************************************************************************/
  calculateOutputSize: function (hexArray: Uint8Array | Array<string>): {
    bytes: number
    kilobytes: number
    formatted: string
  } {
    let byteCount = 0

    if (Array.isArray(hexArray)) {
      byteCount = hexArray.length
    } else if (hexArray instanceof Uint8Array) {
      byteCount = hexArray.length
    }

    const kb = byteCount / 1024

    return {
      bytes: byteCount,
      kilobytes: kb,
      formatted: `${byteCount} 字节 (${kb.toFixed(2)} KB)`,
    }
  },

  /********************************************************************************
   * @brief: 获取取模方式描述
   * @param {number} mode - 取模方式代码
   * @return {string} 取模方式描述
   ********************************************************************************/
  getSamplingModeDescription: function (mode: number): string {
    const modes = {
      0: '逐行式 (从左到右，从上到下)',
      1: '逐列式 (从上到下，从左到右)',
      2: '列行式 (先列后行)',
      3: '行列式 (先行后列)',
    }

    return modes[mode] || '未知取模方式'
  },

  /********************************************************************************
   * @brief: 获取配置数组的默认值
   * @param: 无
   * @return {Array} 默认配置数组
   ********************************************************************************/
  getDefaultConfig: function (): number[] {
    return [
      0, // 反转模式 (0=正常, 1=反转)
      0, // 取模方式 (0=逐行式, 1=逐列式, 2=列行式, 3=行列式)
      0, // 位顺序 (0=正常位序, 1=反转位序)
      0, // 输出格式 (0=带0x前缀, 1=原始数组)
      1, // 颜色模式 (0=彩色, 1=单色)
    ]
  },
}

/********************************************************************************
 * @brief: 为了方便使用，单独导出每个函数
 * @param: 无
 * @return: 函数引用
 ********************************************************************************/
export const generate = ImageToHexArray.generate.bind(ImageToHexArray)
export const imageDataToHexArray =
  ImageToHexArray.imageDataToHexArray.bind(ImageToHexArray)
export const colorImageSampling =
  ImageToHexArray.colorImageSampling.bind(ImageToHexArray)
export const ImageSamplingRow =
  ImageToHexArray.ImageSamplingRow.bind(ImageToHexArray)
export const ImageSamplingCol =
  ImageToHexArray.ImageSamplingCol.bind(ImageToHexArray)
export const ImageSamplingColRow =
  ImageToHexArray.ImageSamplingColRow.bind(ImageToHexArray)
export const ImageSamplingRowCol =
  ImageToHexArray.ImageSamplingRowCol.bind(ImageToHexArray)
export const base64ToImageData =
  ImageToHexArray.base64ToImageData.bind(ImageToHexArray)
export const resizeImageWithKonva =
  ImageToHexArray.resizeImageWithKonva.bind(ImageToHexArray)
export const resizeImageWithCanvas =
  ImageToHexArray.resizeImageWithCanvas.bind(ImageToHexArray)
export const arrayToHex = ImageToHexArray.arrayToHex.bind(ImageToHexArray)
export const hex2hex = ImageToHexArray.hex2hex.bind(ImageToHexArray)
export const generatePreview =
  ImageToHexArray.generatePreview.bind(ImageToHexArray)
export const createImageData =
  ImageToHexArray.createImageData.bind(ImageToHexArray)
export const formatHexOutput =
  ImageToHexArray.formatHexOutput.bind(ImageToHexArray)
export const calculateOutputSize =
  ImageToHexArray.calculateOutputSize.bind(ImageToHexArray)
export const getSamplingModeDescription =
  ImageToHexArray.getSamplingModeDescription.bind(ImageToHexArray)
export const getDefaultConfig =
  ImageToHexArray.getDefaultConfig.bind(ImageToHexArray)

// 默认导出主对象
export default ImageToHexArray
