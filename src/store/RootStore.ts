import { HotKeyStore } from './HotKeyStore';

export interface RootStore {
    recognizeText: string
    hotkey: HotKeyStore
}