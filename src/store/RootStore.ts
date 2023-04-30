import { action, makeObservable, observable } from 'mobx'

import Building from './building/Building'
import InventoryStore from './inventory/InventoryStore'
import { createFromObjects } from './building/factories'
import { Chance } from 'chance'
import CharacterStore from './character/CharacterStore'
import { isBuildingService } from './building/types'
import Order from './order/Order'

export default class RootStore {
  public timeline: Phaser.Time.Timeline
  public buildings: Building[]
  public characters: CharacterStore
  public inventory: InventoryStore
  public orders: Order[]

  constructor(
    timeline: Phaser.Time.Timeline,
    objectLayer: Phaser.Tilemaps.ObjectLayer
  ) {
    this.timeline = makeObservable(timeline, {
      events: observable,
      add: action,
    })
    this.buildings = observable(createFromObjects(objectLayer))
    this.characters = new CharacterStore()
    this.inventory = new InventoryStore()
    this.orders = observable([])
  }

  public init() {
    const chance = Chance()
    const events = []
    for (let i = 0; i < chance.integer({ min: 12, max: 16 }); i++) {
      const spawnTime = i * 22500 + chance.integer({ min: -12, max: 12 }) * 500
      const building = this.buildings.filter(
        (building: Building) => building.type === 'car'
      )[chance.integer({ min: 0, max: 2 })]
      const character = this.characters.create()
      character.isActive = true

      events.push({
        at: spawnTime,
        once: true,
        target: character,
        set: {
          location: building,
        },
      })

      events.push({
        from: character.wants[0].limit,
        once: true,
        target: character,
        set: {
          location: building,
          isActive: false,
        },
      })
    }
    this.timeline.add(events)
  }

  assignCharacter(buildingName: string, characterId: number) {
    const building = this.buildings.find(
      (building) => building.name === buildingName
    )

    const character = this.characters.findById(characterId)

    if (character && building && building.available && building.task) {
      building.assign(character)

      if ('order' in building.task && building.task.order) {
        this.orders.push(
          new Order(this.orders.length, building.task.order.type, character)
        )
      }

      const events = this.timeline.events.splice(
        this.timeline.events.findIndex((event) => event.target === character),
        1
      )

      this.timeline.add({
        once: true,
        in: building.task.duration,
        target: building,
        run: () => {
          if (isBuildingService(building.task)) {
            character.onSatisfied(
              building.task.type,
              events[0].time - this.timeline.elapsed
            )
          }
          if ('reward' in building.task && building.task.reward) {
            const reward = {
              ...building.task.reward,
              money: building.task.reward.money * character.satisfaction,
            }
            this.inventory.add(reward)
          }
          building.onComplete()
        },
      })
    }
  }
}
