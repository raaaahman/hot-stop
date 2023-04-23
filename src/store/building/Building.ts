import { action, computed, makeObservable, observable } from 'mobx'

import { BuildingType } from './BuildingSchema'

export default class Building {
  constructor(
    private _name: string,
    private type: BuildingType,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    public available = true
  ) {
    makeObservable(this, {
      available: observable,
      isAvailable: computed,
      setAvailable: action,
      onComplete: action,
    })
  }

  get name() {
    return this._name
  }

  get boundingRectangle() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  get isAvailable() {
    return this.available
  }

  setAvailable(value = true) {
    this.available = value
  }

  createTask(end: number) {
    return {
      target: this._name,
      at: end,
      once: true,
      run: this.onComplete,
    }
  }

  onComplete() {
    this.available = true
    return {}
  }
}
