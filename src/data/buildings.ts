import { BuildingChore, BuildingService } from '../store/building/types'

export default [
  {
    type: 'car',
  },
  {
    type: 'table',
    tasks: [
      { type: 'place', duration: 1200 },
      { type: 'serve', duration: 2400, reward: { money: 25 } },
      { type: 'clean', duration: 1600 },
    ] as (BuildingChore | BuildingService)[],
  },
]
