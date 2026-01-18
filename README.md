# x-tool

一个实用的 TypeScript 工具函数库，包含各种常用的工具函数。

## 安装

```bash
npm install x-tool
```

## 使用

```typescript
import { unique, capitalize, debounce } from 'x-tool';

// 数组去重
const uniqueArray = unique([1, 2, 2, 3, 3, 3]);

// 字符串首字母大写
const capitalized = capitalize('hello world');

// 防抖函数
const debouncedFn = debounce(() => {
  console.log('防抖执行');
}, 300);
```

## API 文档

### 数组工具
- `unique(arr)` - 数组去重
- `chunk(arr, size)` - 数组分块
- `shuffle(arr)` - 数组随机排序
- `groupBy(arr, key)` - 数组分组
- `flatten(arr)` - 数组扁平化

### 字符串工具
- `capitalize(str)` - 首字母大写
- `camelCase(str)` - 驼峰命名
- `kebabCase(str)` - 短横线命名
- `randomString(length)` - 随机字符串
- `truncate(str, length, suffix)` - 字符串截断

### 对象工具
- `deepClone(obj)` - 深拷贝
- `pick(obj, keys)` - 选择属性
- `omit(obj, keys)` - 排除属性
- `isEmpty(obj)` - 判断空对象

### 函数工具
- `debounce(func, wait)` - 防抖
- `throttle(func, limit)` - 节流
- `memoize(func)` - 记忆化

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run lint
```

## 许可证

MIT