import { describe, it, expect } from 'vitest'

import Building from '../Building'
import TEST_DATA from '../../__test__/data.json'

describe('The Building domain object', () => {
  it('should create an array of instances from Tiled Object Layer data', () => {
    const buildings = Building.createFromObjects(TEST_DATA)

    expect(buildings.length).toBe(2)
    expect(buildings).toEqual([
      expect.objectContaining({ name: 'counter', type: 'counter' }),
      expect.objectContaining({ name: 'kitchen', type: 'kitchen' }),
    ])
  })

  describe('the createTask method', () => {
    it('should schedule the event to be set after the elapsed time passed as argument', () => {
      const building = new Building(
        'kitchen',
        'kitchen',
        256,
        32,
        160,
        128,
        true
      )
      const elapsed = 450

      const task = building.createTask(elapsed)

      expect(task.at).toBeGreaterThanOrEqual(elapsed)
    })

    it('should return a one time event with its name as the target and its onComplete method as callback', () => {
      const building = new Building('rubble1', 'rubble', 32, 64, 128, 96, true)

      const task = building.createTask(300)

      expect(task).toMatchObject({
        target: 'rubble1',
        once: true,
        run: building.onComplete,
      })
    })
  })

  describe('the onComplete method', () => {
    it('should set the building available again', () => {
      const building = new Building(
        'bedroom1',
        'bedroom',
        64,
        128,
        256,
        128,
        false
      )

      building.onComplete()

      expect(building.available).toBe(true)
    })
  })
})
