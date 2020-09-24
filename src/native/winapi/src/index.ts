import { loadAddonFile } from '@/utils/NativeUtil'

const winapi = loadAddonFile('winapi.node')
// const winapi = require('../build/Release/winapi.node')

export function getSystemFonts(): Array<string> {
  return winapi.getSystemFonts()
}
