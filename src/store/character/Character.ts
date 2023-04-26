import { makeAutoObservable } from 'mobx'
import { Chance } from 'chance'

import Building from '../building/Building'

export default class Character {
  static chance = new Chance()
  public name = ''
  public gender: 'male' | 'female' | '' = ''
  public isActive = false
  public location?: Building

  static create(store: Character[]) {
    const character =
      store.find((character) => character.isActive === false) ||
      new Character(store.length + 1)
    character.gender = Character.chance.gender().toLowerCase() as
      | 'male'
      | 'female'
    character.name = Character.chance.name({
      gender: character.gender,
    })

    store.push(character)

    return character
  }

  constructor(private _id: number) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }
}
