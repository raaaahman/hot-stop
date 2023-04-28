import { makeAutoObservable } from 'mobx'

import { BuildingType } from './BuildingSchema'

export default class Building {
  private _currentTask = 0

  constructor(
    private _name: string,
    private _type: BuildingType,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    public _available = true,
    private _tasks: Record<string, any>[] = []
  ) {
    makeAutoObservable(this)
  }

  get name() {
    return this._name
  }

  get type() {
    return this._type
  }

  get task() {
    return { ...this._tasks[this._currentTask] }
  }

  get boundingRectangle() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  get available() {
    return this._available
  }

  setAvailable(value = true) {
    this._available = value
  }

  onComplete() {
    if (this._currentTask === this._tasks.length - 1) {
      this._currentTask = 0
      this._available = true
    } else {
      this._currentTask++
    }
    return {}
  }
}
