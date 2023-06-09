import { action, makeObservable, observable } from 'mobx'

import Building from './building/Building'
import Character from './character/Character'
import InventoryStore from './inventory/InventoryStore'
import { createFromObjects } from './building/factories'

export default class RootStore {
  public timeline: Phaser.Time.Timeline
  public buildings: Building[]
  public characters: Character[]
  public inventory: InventoryStore

  constructor(
    timeline: Phaser.Time.Timeline,
    objectLayer: Phaser.Tilemaps.ObjectLayer
  ) {
    this.timeline = makeObservable(timeline, {
      events: observable,
      add: action,
    })
    this.buildings = observable(createFromObjects(objectLayer))
    this.characters = observable<Character>([])
    this.inventory = new InventoryStore()
  }

  assign(buildingName: string, characterId: number) {
    const building = this.buildings.find(
      (building) => building.name === buildingName
    )
    building?.setAvailable(false)

    const character = this.characters.find(
      (character) => characterId === character.id
    )
    if (character && building) {
      character.location = building
      this.timeline.add({
        once: true,
        at: this.timeline.elapsed + 450,
        target: buildingName,
        run: () => {
          const reward = building.onComplete()
          this.inventory.add(reward)
          building.setAvailable(true)
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
