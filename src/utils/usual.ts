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
 * @brief: 关闭指定Popover
 * @param {string} id
 * @return {*}
 ********************************************************************************/
export const closePopoverByID = (id: string) => {
  const popover = document.querySelector<
    HTMLElement & { hidePopover: () => void }
  >(`#${id}`)
  popover?.hidePopover?.()
}

/********************************************************************************
 * @brief: 关闭页面所有原生Popover
 * @return {*}
 ********************************************************************************/
export const closeAllNativePopover = () => {
  // 获取所有带popover属性的原生弹窗元素
  const allPopovers = document.querySelectorAll<HTMLElement>('[popover]')
  allPopovers.forEach(popoverEl => {
    popoverEl?.hidePopover?.()
  })
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
