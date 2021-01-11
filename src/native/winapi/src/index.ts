import { loadAddonFile } from '@/utils/PathUtil'

const winapi = loadAddonFile('src/native/winapi/build/Release/winapi.node', 'winapi.node')
// const winapi = require('../build/Release/winapi.node')

export function getSystemFonts(): Array<string> {
  return winapi.getSystemFonts()
}
