import { describe, it, expect, beforeEach } from 'vitest'

import Building from '../Building'
import { createFromObjects } from '../factories'
import TEST_DATA from '../../../../public/assets/levels/road_360.json'
import Character from '../../character/Character'
import Order from '../../order/Order'

describe('The Building domain object', () => {
  it('should create an array of instances from Tiled Object Layer data', () => {
    const buildings = createFromObjects(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      TEST_DATA.layers.find((layer) => layer.name === 'rooms')
    )

    expect(buildings.length).toBe(16)
    expect(buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'counter', type: 'counter' }),
        expect.objectContaining({ name: 'kitchen', type: 'kitchen' }),
        expect.objectContaining({ name: 'bedroom1', type: 'bedroom' }),
        expect.objectContaining({ name: 'bedroom2', type: 'bedroom' }),
        expect.objectContaining({ name: 'bedroom3', type: 'bedroom' }),
      ])
    )
  })

  describe('the task getter', () => {
    it('should return a task object that matches the type and duration of the first task in the list', () => {
      const building = new Building(
        'kitchen',
        'kitchen',
        256,
        32,
        160,
        128,
        true,
        [
          { type: 'place', duration: 1200 },
          { type: 'serve', duration: 2400 },
          { type: 'clean', duration: 1200 },
        ]
      )

      expect(building.task.type).toEqual('place')
      expect(building.task.duration).toEqual(1200)
    })
  })

  describe('the assign method', () => {
    let character: Character,
      order: Order,
      buildingWithChore: Building,
      buildingWithService: Building

    beforeEach(() => {
      character = new Character(1)
      order = new Order(1, 'order', character)
      buildingWithService = new Building(
        'table1',
        'table',
        256,
        128,
        160,
        96,
        true,
        [{ type: 'place', duration: 1200 }]
      )
      buildingWithChore = new Building(
        'kitchen',
        'kitchen',
        256,
        32,
        160,
        128,
        true,
        [{ type: 'order', duration: 3600 }]
      )
    })

    it("should set the argument's Character location to the current Building, if the building's current task is a service", () => {
      buildingWithService.assign(character)

      expect(character.location).toBe(buildingWithService)
    })

    it("should not set the argument's Character location to the current Building, if the building's current task is a chore", () => {
      buildingWithChore.assign(character)

      expect(character.location).not.toBe(buildingWithChore)
    })

    it("should set the argument's Order location to the current Building, if the building's current task is a chore", () => {
      buildingWithChore.assign(order)

      expect(order.location).toBe(buildingWithChore)
    })

    it("should not set the argument's Order location to the current Building, if the building's current task is a service", () => {
      buildingWithService.assign(order)

      expect(order.location).not.toBe(buildingWithService)
    })

    it("should set the building as unavailable if the building's current task is a service and the assignee is a Character", () => {
      buildingWithService.assign(character)

      expect(buildingWithService.available).toBe(false)
    })

    it("should not set the building as unavailable if the building's current task is a chore and the assignee is a character", () => {
      buildingWithChore.assign(character)

      expect(buildingWithChore.available).toBe(true)
    })

    it("should set the building as unavailable if the building's current task is a chore and the assignee is an Order", () => {
      buildingWithChore.assign(order)

      expect(buildingWithChore.available).toBe(false)
    })
  })

  describe('the onComplete method', () => {
    it('should advance to the next task in the list', () => {
      const building = new Building(
        'kitchen',
        'kitchen',
        256,
        32,
        160,
        128,
        true,
        [
          { type: 'place', duration: 1200 },
          { type: 'serve', duration: 2400 },
          { type: 'clean', duration: 1200 },
        ]
      )

      building.onComplete()

      expect(building.task.type).toEqual('serve')
    })

    it('should set the task back to the first in the list if the current task is the last in the list', () => {
      const building = new Building(
        'kitchen',
        'kitchen',
        256,
        32,
        160,
        128,
        true,
        [
          { type: 'place', duration: 1200 },
          { type: 'serve', duration: 2400 },
          { type: 'clean', duration: 1200 },
        ]
      )

      building.onComplete()
      building.onComplete()
      building.onComplete()

      expect(building.task.type).toEqual('place')
    })

    it('should set the building available again after the last task has been completed', () => {
      const building = new Building(
        'bedroom1',
        'bedroom',
        64,
        128,
        256,
        128,
        false,
        [
          { type: 'place', duration: 1200 },
          { type: 'serve', duration: 2400 },
          { type: 'clean', duration: 1200 },
        ]
      )

      building.onComplete()

      expect(building.available).toBe(false)

      building.onComplete()

      expect(building.available).toBe(false)

      building.onComplete()

      expect(building.available).toBe(true)
    })
  })
})
