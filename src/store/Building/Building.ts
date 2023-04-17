import { makeAutoObservable } from 'mobx'
import { BuildingData, BuildingType } from './BuildingSchema'

export default class Building {
  static createFromData (data: BuildingData) {
    return new Building(data.name, data.type, data.x, data.y, data.width, data.height)
  }

  constructor (
    private _name: string,
    private type: BuildingType,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    public available = true
  ) {
    makeAutoObservable(this)
  }

  get name () {
    return this._name
  }

  get boundingRectangle () {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  get isAvailable () {
    return this.available
  }

  setAvailable(value = true) {
    this.available = value
  }
}
