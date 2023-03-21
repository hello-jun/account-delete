/*
 * @Author: zhangjun
 * @Date: 2023-03-08 11:46:16
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-20 14:34:03
 * @Description: 
 * @FilePath: /src/utils/utils.ts
 */
export function format(first: string|undefined, middle: string|undefined, last: string|undefined): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export function operatingSystem() {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox &&
      /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  };
}
// 获取设备
function getDeviceType():string|undefined {
  const osinfo = operatingSystem()
  if (osinfo.isAndroid || osinfo.isPhone) {
    return 'mobile'
  } else if (osinfo.isTablet) {
    return 'tablet'
  } else if (osinfo.isPc) {
    return 'pc'
  }
}
export const DEVICETYPE = getDeviceType();