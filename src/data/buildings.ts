import { BuildingChore, BuildingService } from '../store/building/types'

export default [
  {
    type: 'car',
  },
  {
    type: 'table',
    tasks: [
      { type: 'place', duration: 1200, order: { type: 'cook' } },
      {
        type: 'serve',
        duration: 3600,
        order: { type: 'clean' },
        reward: { money: 25 },
      },
      {
        type: 'clean',
        duration: 1200,
      },
    ] as (BuildingChore | BuildingService)[],
  },
  {
    type: 'kitchen-stall',
    tasks: [{ type: 'cook', duration: 4800, order: { type: 'serve' } }],
  },
  {
    type: 'kitchen-sink',
    tasks: [{ type: 'clean', duration: 1600 }],
  },
]
