import Building from './Building'
import BuildingSchema, { BuildingData } from './BuildingSchema'
import BUILDINGS_DATA from '../../data/buildings'

export function createFromObjects(objectLayer: Phaser.Tilemaps.ObjectLayer) {
  return objectLayer.objects
    .filter((obj) => BuildingSchema.safeParse(obj).success)
    .map((obj) => createFromData(obj as BuildingData))
}

export function createFromData(data: BuildingData) {
  return new Building(
    data.name,
    data.type,
    data.x,
    data.y,
    data.width,
    data.height,
    data.properties.find((property) => property.name === 'available')?.value ||
      false,
    BUILDINGS_DATA.find((building) => building.type === data.type)?.tasks || []
  )
}
