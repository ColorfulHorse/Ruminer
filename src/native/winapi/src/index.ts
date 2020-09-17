import path from 'path'

declare const __non_webpack_require__: any
const loadAddonFile = () => {
  const filePath = 'src/native/winapi/build/Release/winapi.node'
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    return __non_webpack_require__(path.join(process.cwd(), filePath))
  } else {
    // eslint-disable-next-line
    return __non_webpack_require__(path.join(process.resourcesPath, filePath))
  }
}

const winapi = loadAddonFile()

export function getSystemFonts(): Array<string> {
  return winapi.getSystemFonts()
}
