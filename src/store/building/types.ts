import { OrderType } from '../order/Order'

export type BuildingService = {
  type: 'place' | 'serve'
  duration: number
  order?: { type: OrderType }
  reward?: { money: number }
}

export function isBuildingService(
  task: BuildingService | BuildingChore
): task is BuildingService {
  return ['place', 'serve'].includes(task.type)
}

export type BuildingChore = {
  type: 'cook' | 'clean'
  duration: number
}

export function isBuildingChore(
  task: BuildingService | BuildingChore
): task is BuildingChore {
  return ['cook', 'clean'].includes(task.type)
}
