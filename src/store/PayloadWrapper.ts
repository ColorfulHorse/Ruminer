export interface IPayloadWrapper<T, P> {
  key: keyof T
  value: P
}

export class PayloadWrapper<T, P> implements IPayloadWrapper<T, P>{
  key: keyof T
  value: P
  constructor(type: keyof T, value: P) {
    this.key = type
    this.value = value
  }
}
