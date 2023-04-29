import { BuildingService } from '../building/types'

export type CharacterWants = {
  type: BuildingService['type']
  limit: number
}
