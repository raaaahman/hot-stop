import { makeAutoObservable } from 'mobx'

export default class Character {
  constructor(
    private _id: number,
    private x: number,
    private y: number,
    private _spriteKey: string
  ) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  get position() {
    return { x: this.x, y: this.y }
  }

  set position(newPosition: { x: number; y: number }) {
    this.x = newPosition.x
    this.y = newPosition.y
  }

  get spriteKey() {
    return this._spriteKey
  }
}
