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
})
