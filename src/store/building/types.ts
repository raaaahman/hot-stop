export type BuildingService = {
  type: 'place' | 'serve'
  duration: number
  reward?: { money: number }
}

export function isBuildingService(
  task: BuildingService | BuildingChore
): task is BuildingService {
  return ['place', 'serve'].includes(task.type)
}

export type BuildingChore = {
  type: 'clean'
  duration: number
}

export function isBuildingChore(
  task: BuildingService | BuildingChore
): task is BuildingChore {
  return ['clean'].includes(task.type)
}
