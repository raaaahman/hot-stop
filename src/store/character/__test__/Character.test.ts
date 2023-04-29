import { describe, it, expect } from 'vitest'
import Character from '../Character'

describe('The Character class', () => {
  describe('the onSatisfied method', () => {
    it('should move character wants to the next in list', () => {
      const character = new Character(1)
      character.wants = [
        { type: 'place', limit: 2400 },
        { type: 'serve', limit: 4200 },
      ]

      character.onSatisfied('place')

      expect(character.wants).toHaveLength(1)
      expect(character.wants).not.toContainEqual(
        expect.objectContaining({ type: 'place', limit: 2400 })
      )
      expect(character.wants).toContainEqual(
        expect.objectContaining({ type: 'serve', limit: 4200 })
      )
    })
  })
})
