import { action, makeObservable, observable } from 'mobx'

import Building from './building/Building'
import InventoryStore from './inventory/InventoryStore'
import { createFromObjects } from './building/factories'
import { Chance } from 'chance'
import CharacterStore from './character/CharacterStore'
import { isBuildingService } from './building/types'
import OrderStore from './order/OrderStore'
import { SOUNDS } from '../resources'

export default class RootStore {
  public timeline: Phaser.Time.Timeline
  public buildings: Building[]
  public characters: CharacterStore
  public inventory: InventoryStore
  public orders: OrderStore

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
    this.orders = new OrderStore()
  }

  public init() {
    const chance = Chance()
    const events = []
    const customersNb = chance.integer({ min: 12, max: 16 })
    for (let i = 0; i < customersNb; i++) {
      const spawnTime =
        i * (120000 / customersNb) + chance.integer({ min: -8, max: 8 }) * 500
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
          isActive: false,
        },
        sound: SOUNDS.LEAVE,
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

      const events = this.timeline.events.splice(
        this.timeline.events.findIndex((event) => event.target === character),
        1
      )

      this.timeline.add({
        once: true,
        in: character.wants[0].limit,
        target: character,
        set: {
          isActive: false,
        },
        sound: SOUNDS.LEAVE,
      })

      this.timeline.add({
        once: true,
        in: building.task.duration,
        target: building,
        run: () => {
          if (isBuildingService(building.task)) {
            character.onSatisfied(
              building.task.type,
              events.length > 0 ? events[0].time - this.timeline.elapsed : 0
            )
          }

          if ('order' in building.task && building.task.order) {
            this.orders.create(building.task.order.type, character)
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

  assignOrder(buildingName: string, orderId: integer) {
    const building = this.buildings.find(
      (building) => building.name === buildingName
    )

    const order = this.orders.findById(orderId)

    if (
      building &&
      order &&
      building.available &&
      order.type === building.task.type
    ) {
      const events = this.timeline.events.splice(
        this.timeline.events.findIndex((event) => event.target === order.from),
        1
      )

      building.assign(order)

      this.timeline.add({
        once: true,
        in: building.task.duration,
        target: building,
        run: () => {
          if (order.type === 'cook') {
            order.from.onSatisfied(
              'serve',
              events[0].time - this.timeline.elapsed
            )
          }

          if (
            order.from?.location?.task &&
            'order' in order.from.location.task &&
            order.from.location.task.order
          ) {
            this.orders.create(order.from.location.task.order.type, order.from)
          }

          if (
            order.from?.location?.task &&
            'reward' in order.from.location.task &&
            order.from.location.task.reward
          ) {
            this.inventory.add({
              money:
                order.from.location.task.reward.money * order.from.satisfaction,
            })
          }

          if (
            order.type === order.from.location?.task.type ||
            (order.type === 'cook' &&
              order.from.location?.task.type === 'serve')
          ) {
            order.from.location?.onComplete()
          }

          if (order.location) {
            order.location.onComplete()
          }

          this.orders.remove(order.id)
        },
      })
    }
  }
}
