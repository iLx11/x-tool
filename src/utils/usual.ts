
/********************************************************************************
 * @brief: 判断 popover 是否显示
 * @param {string} popId
 * @return {*}
 ********************************************************************************/
export function isShowPopover(popId: string) {
  const box = document.getElementById(popId) // 1. 先拿元素
  const isShow =
    box &&
    window.getComputedStyle(box).display !== 'none' &&
    box.getAttribute('aria-hidden') !== 'true'
  return isShow
}

/********************************************************************************
 * @brief: 判断图片是否有效
 * @param {string} src
 * @return {*}
 ********************************************************************************/
export function isImageValid(src: string | File) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = typeof src === 'string' ? src : URL.createObjectURL(src)
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
  })
}
