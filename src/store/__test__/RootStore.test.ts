import { describe, beforeEach, it, expect, vi } from 'vitest'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Timeline from 'phaser/src/time/Timeline.js'

import RootStore from '../RootStore'
import Building from '../building/Building'
import Character from '../character/Character'
import TEST_DATA from './data.json'

vi.mock('phaser/src/time/Timeline.js', () => ({
  default: class {
    events: object[] = []

    add = vi.fn()
  },
}))

describe('The RootStore', () => {
  describe('the assign function', () => {
    let store: RootStore

    beforeEach(() => {
      store = new RootStore(new Timeline(), TEST_DATA)
      const counter = store.buildings.find(
        (building) => building.name === 'counter'
      )
      store.characters.push(
        new Character(0, counter as Building, 'a_character_sprite')
      )
    })

    it('should set the new location of the character to the building with the given name', () => {
      store.assign('kitchen', 0)

      const kitchen = store.buildings.find(
        (building) => building.name === 'kitchen'
      )

      expect(store.characters).toEqual([
        expect.objectContaining({ id: 0, location: kitchen }),
      ])
    })
  })
})
