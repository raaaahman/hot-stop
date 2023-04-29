import { makeAutoObservable } from 'mobx'

import Building from '../building/Building'
import { CharacterWants } from './types'
import { BuildingService } from '../building/types'

export default class Character {
  public name = ''
  public gender: 'male' | 'female' | '' = ''
  public isActive = false
  public location?: Building
  public wants: CharacterWants[] = []

  constructor(private _id: number) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  onSatisfied(type: BuildingService['type']) {
    if (this.wants[0]?.type === type) {
      this.wants?.splice(0, 1)
    }
  }
}
