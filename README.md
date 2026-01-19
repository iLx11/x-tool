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

#### 图片处理
- `isImageValid(src: string | File): Promise<boolean>` - 判断图片是否有效
  - `src`: 图片 URL 或 File 对象



## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build
```

## 许可证

MIT