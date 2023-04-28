import { describe, it, expect } from 'vitest'

import InventoryStore from '../InventoryStore'

describe('The InventoryStore', () => {
  describe('the add method', () => {
    it('should add the money from the reward to the current money', () => {
      const store = new InventoryStore()

      store.add({ money: 20 })

      expect(store.money).toEqual(20)

      store.add({ money: 5 })

      expect(store.money).toEqual(25)
    })
  })
})
