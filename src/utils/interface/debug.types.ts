declare global {
  /**
   * @brief: 扩展Window接口，添加自定义环境变量属性__ENV__
   * @desc: 解决TS2339错误：Property '__ENV__' does not exist on type 'Window'
   */
  interface Window {
    __ENV__?: {
      MODE: 'development' | 'production' | string; // 环境模式（开发/生产）
    };
  }
}