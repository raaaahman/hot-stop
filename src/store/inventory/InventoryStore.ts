import { makeAutoObservable } from 'mobx'

export default class InventoryStore {
  private _money = 0

  constructor() {
    makeAutoObservable(this)
  }

  get money() {
    return this._money
  }

  add(reward: Record<string, any>) {
    if ('money' in reward) {
      this._money += reward.money
    }
  }
}
