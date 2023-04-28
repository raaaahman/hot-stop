import { describe, beforeEach, it, expect, vi } from 'vitest'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Timeline from 'phaser/src/time/Timeline.js'

import RootStore from '../RootStore'
import Building from '../building/Building'
import Character from '../character/Character'
import TEST_DATA from '../../../public/assets/levels/road_360.json'

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

  describe('the assign method', () => {
    it('should set the new location of the character to the building with the given name', () => {
      store.assign('kitchen', character.id)

      const kitchen = store.buildings.find(
        (building) => building.name === 'kitchen'
      )

      expect(character.location).toBe(kitchen)
    })

    it('should make building with the assigned unavailable', () => {
      store.assign('kitchen', character.id)

      expect(store.buildings).toContainEqual(
        expect.objectContaining({ name: 'kitchen', isAvailable: false })
      )
    })

    it('should add an event to the timeline', () => {
      vi.spyOn(store.timeline, 'add')
      store.assign('kitchen', character.id)

      expect(store.timeline.add).toHaveBeenCalledWith(
        expect.objectContaining({
          target: store.buildings.find((current) => current.name === 'kitchen'),
        })
      )
    })
  })

  describe('the timeline events', () => {
    it('should call the onComplete method from the building where the character is assigned', () => {
      const kitchen = store.buildings.find(
        (building) => building.name === 'kitchen'
      ) as Building
      vi.spyOn(kitchen, 'onComplete')

      store.assign('kitchen', character.id)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.timeline.events.find((event) => event.target === kitchen)?.run()

      expect(kitchen.onComplete).toHaveBeenCalledTimes(1)
    })
  })
})
