import { makeAutoObservable } from 'mobx'
import Character from '../character/Character'
import Building from '../building/Building'

export type OrderType = 'cook' | 'clean'

export default class Order {
  public location?: Building
  public active = false

  constructor(
    private _id: number,
    public type: OrderType,
    public from: Character
  ) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }
}
