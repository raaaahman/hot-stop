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
  private _satisfaction = 1

  constructor(private _id: number) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  get satisfaction() {
    return this._satisfaction
  }

  onSatisfied(type: BuildingService['type'], remainingTime: number) {
    if (this.wants[0]?.type === type) {
      this._satisfaction += remainingTime / this.wants[0].limit
      this.wants?.splice(0, 1)
    }
  }
}
