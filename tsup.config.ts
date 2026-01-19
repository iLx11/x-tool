import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // 工具库入口文件
  format: ['cjs', 'esm'], // 输出两种模块格式：CommonJS + ESModule
  dts: true, // 自动生成类型声明文件（无需手动处理）
  clean: true, // 打包前清空dist目录
  outDir: 'dist', // 输出目录
  minify: true, // 开发阶段不压缩（发布时改为true）
  sourcemap: true, // 生成sourcemap
})
