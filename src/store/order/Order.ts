import { makeAutoObservable } from 'mobx'
import Character from '../character/Character'

export type OrderType = 'order' | 'clean'

export default class Order {
  constructor(
    private _id: number,
    private _type: OrderType,
    private _from: Character
  ) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  get type() {
    return this._type
  }

  get from() {
    return this._from
  }
}
