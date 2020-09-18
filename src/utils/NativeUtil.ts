import path from 'path'

declare const __non_webpack_require__: any
export function loadAddonFile(src: string) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    return __non_webpack_require__(path.join(process.cwd(), src))
  } else {
    // eslint-disable-next-line
    return __non_webpack_require__(path.join(process.resourcesPath, src))
  }
}
