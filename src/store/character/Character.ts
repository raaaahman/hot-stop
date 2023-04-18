import { makeAutoObservable } from 'mobx'

import Building from '../building/Building'

export default class Character {
  constructor(
    private _id: number,
    public location: Building,
    private _spriteKey: string
  ) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  get spriteKey() {
    return this._spriteKey
  }
}
