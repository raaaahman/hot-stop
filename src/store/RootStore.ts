import { action, makeObservable, observable } from 'mobx'

import Building from './building/Building'
import Character from './character/Character'

export default class RootStore {
  public timeline: Phaser.Time.Timeline
  public buildings: Building[]
  public characters: Character[]

  constructor(
    timeline: Phaser.Time.Timeline,
    objectLayer: Phaser.Tilemaps.ObjectLayer
  ) {
    this.timeline = makeObservable(timeline, {
      events: observable,
      add: action,
    })
    this.buildings = observable(Building.createFromObjects(objectLayer))
    this.characters = observable<Character>([])
  }

  assign(
    dropZone: Phaser.GameObjects.Zone,
    gameObject: Phaser.GameObjects.Image
  ) {
    const building = this.buildings.find(
      (building) => building.name === dropZone.name
    )
    building?.setAvailable(false)

    const character = this.characters.find(
      (character) => gameObject.name === 'character-' + character.id
    )
    if (character && building) {
      character.location = building
      this.timeline.add({
        once: true,
        at: this.timeline.elapsed + 450,
        target: dropZone,
        run: () => {
          building?.setAvailable(true)
          const counterBuilding = this.buildings.find(
            (building) => building.name === 'counter'
          )
          if (counterBuilding) {
            character.location = counterBuilding
          }
        },
      })
    }
  }
}
