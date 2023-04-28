import { action, computed, makeObservable, observable } from 'mobx'

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
    public available = true,
    private _tasks: Record<string, any>[] = []
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

  get isAvailable() {
    return this.available
  }

  setAvailable(value = true) {
    this.available = value
  }

  private nextTask() {
    this._currentTask =
      this._currentTask === this._tasks.length - 1 ? 0 : this._currentTask + 1
  }

  onComplete() {
    this.nextTask()
    this.available = true
    return {}
  }
}
