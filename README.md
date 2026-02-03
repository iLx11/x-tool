# ilx1-x-tool

一个实用的 TypeScript 工具函数库，包含各种常用的工具函数。

## 安装

```bash
npm install ilx1-x-tool
```

## 使用

```typescript
import { xxx } from 'ilx1-x-tool'
```

## API 文档

### 图像数据处理工具 (imageData.ts)

#### 配置接口

- `IConfig` - 图像数据处理配置接口
  - `reverseValue: number` - 反转数值 (0：反转数值)
  - `modMode: number` - 取模方式 (0：逐行，1：逐列，2：列行，3：行列)
  - `reverseBit: number` - 反转位序 (2：反转位序)
  - `outputMode: number` - 输出模式 (0：十六进制数组，1：字节数组)

#### 图像处理主对象

- `ImageToHexArray` - 图像处理工具函数库主对象

#### 主要功能函数

- `generate(picData: string, thresholdData: number, config: number[]): Promise<Uint8Array>` - 生成十六进制数组
  - `picData`: base64图像数据
  - `thresholdData`: 阈值
  - `config`: 配置数组
  - 返回：十六进制数组

- `imageDataToHexArray(imageData: ImageData, threshold: number, config: number[]): Uint8Array` - ImageData 对象转 hexArray
  - `imageData`: 图像数据对象
  - `threshold`: 阈值
  - `config`: 配置数组
  - 返回：处理后的字节数组

- `colorImageSampling(pixels: Uint8ClampedArray, width: number, height: number, config: number[]): Uint8Array` - 彩色图像取模 (RGB565格式)
  - `pixels`: 像素数组
  - `width`: 图像宽度
  - `height`: 图像高度
  - `config`: 配置数组
  - 返回：RGB565格式的字节数组

#### 取模函数

- `ImageSamplingRow(unpackedBuffer: number[], width: number, height: number, config: number[]): Uint8Array` - 逐行式取模 (从左到右，从上到下)
  - `unpackedBuffer`: 解压后的像素缓冲区
  - `width`: 图像宽度
  - `height`: 图像高度
  - `config`: 配置数组
  - 返回：取模后的字节数组

- `ImageSamplingCol(unpackedBuffer: number[], width: number, height: number, config: number[]): Uint8Array` - 逐列式取模 (从上到下，从左到右)
  - `unpackedBuffer`: 解压后的像素缓冲区
  - `width`: 图像宽度
  - `height`: 图像高度
  - `config`: 配置数组
  - 返回：取模后的字节数组

- `ImageSamplingColRow(unpackedBuffer: number[], width: number, height: number, config: number[]): Uint8Array` - 列行式取模 (先列后行)
  - `unpackedBuffer`: 解压后的像素缓冲区
  - `width`: 图像宽度
  - `height`: 图像高度
  - `config`: 配置数组
  - 返回：取模后的字节数组

- `ImageSamplingRowCol(unpackedBuffer: number[], width: number, height: number, config: number[]): Uint8Array` - 行列式取模 (先行后列)
  - `unpackedBuffer`: 解压后的像素缓冲区
  - `width`: 图像宽度
  - `height`: 图像高度
  - `config`: 配置数组
  - 返回：取模后的字节数组

#### 图像转换函数

- `base64ToImageData(base64Data: string): Promise<ImageData>` - base64 转 ImageData 对象
  - `base64Data`: base64编码的图像数据
  - 返回：ImageData对象

- `resizeImageWithKonva(width: number, height: number, image: HTMLImageElement, colorMode: boolean): Promise<string>` - 使用 Konva.js 缩放图像
  - `width`: 目标宽度
  - `height`: 目标高度
  - `image`: 源图像对象
  - `colorMode`: 是否转换为灰度
  - 返回：base64编码的缩放后图像

- `resizeImageWithCanvas(width: number, height: number, image: HTMLImageElement, colorMode: boolean): Promise<string>` - 使用 Canvas API 缩放图像 (Konva不可用时的备选方案)
  - `width`: 目标宽度
  - `height`: 目标高度
  - `image`: 源图像对象
  - `colorMode`: 是否转换为灰度
  - 返回：base64编码的缩放后图像

#### 数据格式转换函数

- `arrayToHex(array: Uint8Array): string` - Uint8Array 转十六进制字符串
  - `array`: 字节数组
  - 返回：十六进制字符串

- `hex2hex(hex: string): Array<string>` - 十六进制数据加 '0x' 前缀
  - `hex`: 十六进制字符串
  - 返回：带0x前缀的十六进制数组

- `generatePreview(unpackedBuffer: Uint8Array, width: number): string` - 生成取模预览 (0=白点, 1=黑点)
  - `unpackedBuffer`: 解压后的像素缓冲区
  - `width`: 图像宽度
  - 返回：预览字符串

#### 辅助函数

- `createImageData(width: number, height: number, data: Uint8ClampedArray = null): ImageData` - 创建图像数据对象（兼容性函数）
  - `width`: 图像宽度
  - `height`: 图像高度
  - `data`: 像素数据（可选）
  - 返回：ImageData对象

- `formatHexOutput(hexArray: Uint8Array | Array<string>, format = 0, lineBreak = 16): string` - 将字节数组格式化为可读字符串
  - `hexArray`: 十六进制数组
  - `format`: 输出格式 (0=带0x前缀, 1=原始数组)
  - `lineBreak`: 每行显示的字节数
  - 返回：格式化后的字符串

### 颜色工具 (color.ts)

#### 颜色解析与转换

- `parseColorString(str: string): ParsedColor | null` - 解析颜色字符串（支持 rgb/rgba/hsv/hsl 格式）
  - `str`: 待解析的颜色字符串（如 "hsl(120, 100%, 50%)"、"hsla(240, 50%, 70%, 0.8)"）
- `hslToRgb(hsl: ParsedHSL | ParsedHSLA | null): ParsedColor | null` - HSL 转 RGB 颜色转换
  - `hsl`: HSL 颜色对象（分量范围 0-255）
- `rgbToHsl(rgb: ParsedRGB | ParsedRGBA | null): ParsedColor | null` - RGB 转 HSL 颜色转换
  - `rgb`: RGB 颜色对象（分量范围 0-255）
- `hsvToHsl(hsv: ParsedHSV): ParsedColor` - HSV 转 HSL 颜色转换
  - `hsv`: HSV 颜色对象（分量范围 0-255）
- `hslToHsv(hsl: ParsedHSL): ParsedColor` - HSL 转 HSV 颜色转换
  - `hsl`: HSL 颜色对象（分量范围 0-255）

### 数据处理工具 (data.ts)

#### 字节序处理

- `Endianness` - 字节序枚举（LITTLE: 'little', BIG: 'big'）

#### 数字与字节数组转换

- `numToBytes(number: number, byteCount: number, endian: Endianness = Endianness.BIG): number[]` - 将数字转换为指定字节序的字节数组
  - `number`: 待转换的数字（自动截断为无符号整数）
  - `byteCount`: 目标字节长度（必须为正整数）
  - `endian`: 字节序（默认大端）
- `bytesToNum(bytes: number[], endian: Endianness = Endianness.BIG): number` - 将任意长度的字节数组转换为数字（支持不同字节序）
  - `bytes`: 字节数组
  - `endian`: 字节序（默认小端）
- `numToBits16(number: number, endian: Endianness = Endianness.BIG): [number, number]` - 将数字转换为16位无符号整数的指定字节序字节数组（固定2字节）
  - `number`: 待转换的数字（自动截断为16位无符号整数范围）
  - `endian`: 字节序（默认小端）
- `bits16ToNum(bytes: [number, number], endian: Endianness = Endianness.BIG): number` - 将16位字节数组转换为数字
  - `bytes`: 长度为2的字节数组
  - `endian`: 字节序（默认小端）

#### ASCII 码转换

- `numToAsciiArr(n: number): number[]` - 将数字转换为ASCII码值数组（每个数字转换为其对应的ASCII码）
  - `n`: 待转换的数字（自动取绝对值）
- `asciiArrToNum(ascii: number[]): number` - 将ASCII码值数组转换为对应的数字
  - `ascii`: ASCII码值数组（每个元素为0-255的整数）

### Gzip 压缩工具 (gzip.ts)

#### JSON 压缩与解压

- `compressJsonGzip(data: any): Blob` - gzip 压缩 JSON 数据（转成 Blob，适合导出）
  - `data`: 待压缩的 JSON 数据
- `decompressJsonGzip(file: File): Promise<any>` - 解压 gzip 格式的 JSON 文件
  - `file`: 待解压的 gzip 文件

### HID 键码工具 (hidKeyCode.ts)

#### 键码映射

- `hidKeyCode` - HID 键码数组，包含各种按键的键码信息

#### 键码映射获取

- `getHIDCodeMapStr(): Map<string, (typeof hidKeyCode)[0]>` - 获取 HID 键码映射（主键名 + 别名）

- `getHIDCodeMapStrNum(): Map<number, (typeof hidKeyCode)[0]>` - 获取 HID 键码映射（value 映射）

### 结果工具 (result.ts)

#### 结果对象创建

- `successResult<T = unknown>(data: T = null as unknown as T, message: string = '', code: number = 0): Result<T>` - 创建成功的结果对象
  - `data`: 业务数据（可选，默认 null）
  - `message`: 成功信息（可选，默认空字符串）
  - `code`: 成功状态码（可选，默认 0）
- `errorResult<T = unknown>(message: string, code: number = -1, data: T = null as unknown as T): Result<T>` - 创建失败的结果对象
  - `message`: 错误信息（必选）
  - `code`: 错误码（可选，默认 -1）
  - `data`: 错误相关数据（可选，默认 null）

### 常用工具 (usual.ts)

#### UI 相关

- `isShowPopover(popId: string): boolean` - 判断 popover 是否显示
  - `popId`: popover 元素的 ID
- `closePopoverByID(id: string): void` - 关闭指定 ID 的 popover
  - `id`: popover 元素的 ID
- `closeAllNativePopover(): void` - 关闭页面所有原生 popover

#### 图片处理

- `isImageValid(src: string | File): Promise<boolean>` - 判断图片是否有效
  - `src`: 图片 URL 或 File 对象

### 调试工具 (debug.ts)

#### 日志输出函数

- `log(...args: any[]): void` - 封装 console.log 方法（可开关控制）
  - `args`: 日志打印参数（任意数量、任意类型）
- `info(...args: any[]): void` - 封装 console.info 方法（可开关控制）
  - `args`: 日志打印参数（任意数量、任意类型）
- `warn(...args: any[]): void` - 封装 console.warn 方法（可开关控制）
  - `args`: 日志打印参数（任意数量、任意类型）
- `error(...args: any[]): void` - 封装 console.error 方法（可开关控制，默认生产环境保留）
  - `args`: 日志打印参数（任意数量、任意类型）
- `debug(...args: any[]): void` - 封装 console.debug 方法（可开关控制）
  - `args`: 日志打印参数（任意数量、任意类型）

#### 配置控制函数

- `setLoggerConfig(config: Partial<LoggerConfig>): void` - 动态修改日志工具配置
  - `config`: 要修改的配置项（可选，无需传全部）
- `resetLoggerConfig(): void` - 重置日志工具配置为默认值

- `enableAllLogs(): void` - 强制开启所有日志（临时调试用）

- `disableAllLogs(): void` - 强制关闭所有日志（紧急生产环境用）

#### 类型定义

- `ConsoleType` - 日志类型枚举（'log' | 'info' | 'warn' | 'error' | 'debug'）
- `LoggerConfig` - 日志工具配置项接口
  - `enable`: 是否开启调试模式（true=输出日志，false=关闭日志）
  - `reserveTypes`: 强制保留的日志类型（即使关闭调试，这些类型仍会输出）
  - `prefix`: 日志前缀（用于区分自定义日志和原生日志）

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build
```

## 许可证

MIT
