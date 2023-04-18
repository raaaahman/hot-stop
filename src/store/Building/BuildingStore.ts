import { makeAutoObservable } from 'mobx'

import BuildingSchema, { BuildingData } from './BuildingSchema'
import Building from './Building'

export default class BuildingStore {
  static createFromObjects(objectLayer: Phaser.Tilemaps.ObjectLayer) {
    const objects = objectLayer.objects
      .filter((obj) => BuildingSchema.safeParse(obj).success)
      .map((obj) => Building.createFromData(obj as BuildingData))

    return new BuildingStore(objects)
  }

  constructor(public buildings: Building[] = []) {
    makeAutoObservable(this)
  }
}
