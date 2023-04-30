import { describe, beforeEach, it, expect, vi } from 'vitest'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Timeline from 'phaser/src/time/Timeline.js'

import RootStore from '../RootStore'
import Building from '../building/Building'
import Character from '../character/Character'
import TEST_DATA from '../../../public/assets/levels/road_360.json'
import { BuildingService } from '../building/types'

vi.mock('phaser/src/time/Timeline.js', () => ({
  default: class {
    events: object[] = []

    add(config: object) {
      this.events.push(config)
    }
  },
}))

describe('The RootStore', () => {
  let store: RootStore
  let character: Character

  beforeEach(() => {
    store = new RootStore(
      new Timeline(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      TEST_DATA.layers.find((layer) => layer.name === 'rooms')
    )
    character = store.characters.create()
  })

  describe('the assignCharacter method', () => {
    it('should set the new location of the character to the building with the given name', () => {
      store.assignCharacter('table1', character.id)

      const building = store.buildings.find(
        (building) => building.name === 'table1'
      )

      expect(character.location).toBe(building)
    })

    it('should make building with the assigned character unavailable', () => {
      store.assignCharacter('table1', character.id)

      expect(store.buildings).toContainEqual(
        expect.objectContaining({ name: 'table1', available: false })
      )
    })

    it('should remove old event that targets this character', () => {
      const previousEvent = {
        target: character,
      }
      store.timeline.add(previousEvent)

      store.assignCharacter('kitchen1', character.id)

      expect(store.timeline.events).not.toEqual(
        expect.arrayContaining([previousEvent])
      )
    })

    it('should add an event to the timeline', () => {
      vi.spyOn(store.timeline, 'add')
      store.assignCharacter('kitchen1', character.id)

      expect(store.timeline.add).toHaveBeenCalledWith(
        expect.objectContaining({
          target: store.buildings.find(
            (current) => current.name === 'kitchen1'
          ),
        })
      )
    })
  })

  describe('the timeline events', () => {
    it('should call the onComplete method from the building where the character is assigned', () => {
      const kitchen = store.buildings.find(
        (building) => building.name === 'kitchen1'
      ) as Building
      vi.spyOn(kitchen, 'onComplete')

      runEvent(kitchen, character)

      expect(kitchen.onComplete).toHaveBeenCalledTimes(1)
    })

    it('should call the onSatisfied method from the assigned character with the type of the building task', () => {
      const building = new Building('table5', 'table', 96, 64, 64, 96, true, [
        { type: 'place', duration: 1200 },
      ])
      store.buildings.push(building)
      const mock = vi.spyOn(character, 'onSatisfied').mock
      store.timeline.add({
        time: character.wants[0]?.limit,
        target: character,
      })
      store.timeline.elapsed = 0

      runEvent(building, character)

      expect(mock.calls[0]).toEqual(
        expect.arrayContaining([building.task.type])
      )
    })

    it.each([
      [1, 'full', 1],
      [1.5, 'half', 0.5],
      [2, 'no', 0],
    ])(
      "should add the reward from the building's task to the inventory, multiplied by a factor of %d for %s time elapsed",
      (rewardMultiplier, ratio, timeMultiplier) => {
        const service = {
          type: character.wants[0].type,
          duration: 1500,
          reward: { money: 25 },
        }
        const building = new Building(
          'table5',
          'table',
          64,
          96,
          128,
          256,
          true,
          [service as BuildingService]
        )
        store.buildings.push(building)
        store.timeline.add({
          time: character.wants[0].limit,
          target: character,
        })
        store.timeline.elapsed = character.wants[0].limit * timeMultiplier

        runEvent(building, character)

        expect(store.inventory.money).toEqual(
          service.reward.money * rewardMultiplier
        )
      }
    )

    it("should add an order to the store if the task has an 'order' property", () => {
      store.assignCharacter('table1', character.id)

      runEvent(
        store.buildings.find(
          (building) => building.name === 'table1'
        ) as Building,
        character
      )

      expect(store.orders.findById(0)).toMatchObject({ from: character })
    })

    function runEvent(building: Building, character: Character) {
      store.assignCharacter(building.name, character.id)
      const event = store.timeline.events.find(
        (event) => event.target === building
      )
      if (event) {
        event.run()
      } else {
        throw new Error('Something went wrong when creating the event')
      }
    }
  })
})
