import { describe, it, expect } from 'vitest'

import Building from '../Building'
import { createFromObjects } from '../factories'
import TEST_DATA from '../../../../public/assets/levels/road_360.json'
import Character from '../../character/Character'

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
