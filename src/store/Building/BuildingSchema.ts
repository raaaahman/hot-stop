import { z } from 'zod'

export const BuildingTypeSchema = z.enum([
  'rubble',
  'table',
  'kitchen',
  'bedroom',
  'wall'
])

export type BuildingType = z.infer<typeof BuildingTypeSchema>

export const BuildingPropertySchema = z.enum(['available'])

export type BuildingCustomProperty = z.infer<typeof BuildingPropertySchema>

const BuildingSchema = z.object({
  name: z.string(),
  type: BuildingTypeSchema,
  x: z.number().int(),
  y: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  properties: z.array(z.object({
    name: BuildingPropertySchema,
    type: z.string(),
    value: z.any()
  }))
})

export default BuildingSchema

export type BuildingData = z.infer<typeof BuildingSchema>
