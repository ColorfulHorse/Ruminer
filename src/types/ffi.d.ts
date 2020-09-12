declare module 'ref-wchar-napi' {
  import { Type } from "ref-napi";

  export interface Wchar extends Type {
    /** The size in bytes required to hold this datatype. */
    size: number;
    /** The current level of indirection of the buffer. */
    indirection: number;
    /** To invoke when `ref.get` is invoked on a buffer of this type. */
    get(buffer: any, offset: number): any;
    /** To invoke when `ref.set` is invoked on a buffer of this type. */
    set(buffer: any, offset: number, value: any): any;
    /** The name to use during debugging for this datatype. */
    name?: string;
    /** The alignment of this datatype when placed inside a struct. */
    alignment?: number;
  }

  const wchar: Wchar
  export default wchar
  export const string: Wchar
  export function toString(buf: Buffer): string
}
