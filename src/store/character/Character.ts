import { makeAutoObservable } from 'mobx'

import Building from '../building/Building'
import { CharacterWants } from './types'
import { BuildingService } from '../building/types'

export default class Character {
  public name = ''
  public gender: 'male' | 'female' | '' = ''
  public isActive = false
  public location?: Building
  public wants?: CharacterWants

  constructor(private _id: number) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  onSatisfied(type: BuildingService['type']) {
    //TODO: Implement function
  }
}
