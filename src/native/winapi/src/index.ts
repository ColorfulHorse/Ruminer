import { loadAddonFile } from '@/utils/NativeUtil'

const winapi = loadAddonFile('src/native/winapi/build/Release/winapi.node')

export function getSystemFonts(): Array<string> {
  return winapi.getSystemFonts()
}
