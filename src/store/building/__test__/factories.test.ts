import { describe, it, expect } from 'vitest'

import LEVEL_DATA from '../../../../public/assets/levels/road_360.json'
import { createFromData, createFromObjects } from '../factories'
import Building from '../Building'

describe('The createFromObjects factory function', () => {
  it("should create a Building instance for each object in the 'rooms' layer", () => {
    const buildings = createFromObjects(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      LEVEL_DATA.layers.find((layer) => layer.name === 'rooms')
    )

    expect(buildings).toHaveLength(16)
    buildings.forEach((building) => expect(building).toBeInstanceOf(Building))
  })
})

describe('The createFromData factory function', () => {
  it('should create tasks corresponding to the building type', () => {
    const building = createFromData({
      name: 'table1',
      type: 'table',
      x: 64,
      y: 128,
      width: 128,
      height: 96,
      properties: [],
    })

    expect(building.task).toEqual(
      expect.objectContaining({
        type: 'place',
        duration: 1200,
      })
    )
  })
})
