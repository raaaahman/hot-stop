import { describe, it, expect } from 'vitest'
import RubblePile from './RubblePile'

describe('The RubblePile building', () => {
  describe('the createTask method', () => {
    it('should create task that will be resolved after the current elpased time plus the task duration', () => {
      const building = new RubblePile('rubble1', 64, 128, 96, 64, 2400, {})

      const task = building.createTask(1200)

      expect(task.at).toEqual(3600)
    })
  })

  describe('the onComplete method', () => {
    it('should return the reward defined in the building properties', () => {
      const REWARD = { scraps: 50 }
      const building = new RubblePile('rubble2', 64, 128, 64, 96, 1200, REWARD)

      const reward = building.onComplete()

      expect(reward).toEqual(REWARD)
    })
  })
})
