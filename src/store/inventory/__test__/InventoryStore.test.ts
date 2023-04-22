import { describe, it, expect } from 'vitest'

import InventoryStore from '../InventoryStore'

describe('The InventoryStore', () => {
  describe('the add method', () => {
    it('should add the scraps from the raward to the current scraps', () => {
      const store = new InventoryStore()

      store.add({ scraps: 20 })

      expect(store.scraps).toEqual(20)

      store.add({ scraps: 5 })

      expect(store.scraps).toEqual(25)
    })
  })
})
