import { makeAutoObservable } from 'mobx'

export default class InventoryStore {
  private _scraps = 0

  constructor() {
    makeAutoObservable(this)
  }

  get scraps() {
    return this._scraps
  }

  add(reward: Record<string, any>) {
    if ('scraps' in reward) {
      this._scraps += reward.scraps
    }
  }
}
