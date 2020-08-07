import HotKeyStore from './HotKeyStore';
import TranslateStore from './TranslateStore'

export default interface RootStore {
    hotkey: HotKeyStore
    translate: TranslateStore
}
