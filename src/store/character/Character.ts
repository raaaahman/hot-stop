import { makeAutoObservable } from 'mobx'
import { Chance } from 'chance'
import Building from '../building/Building'
import { SPRITE_CHARACTER } from '../../resources'

export default class Character {
  static chance = new Chance()

  static create(store: Character[], location: Building) {
    const highestID = store.reduce(
      (highest, character) => (character.id > highest ? character.id : highest),
      0
    )

    const gender = Character.chance.gender()
    return new Character(
      highestID,
      Character.chance.name({
        gender: gender.toLowerCase() as 'male' | 'female',
      }),
      location,
      SPRITE_CHARACTER[gender.toUpperCase() as 'MALE' | 'FEMALE'].at(
        Character.chance.integer({
          min: 0,
          max:
            SPRITE_CHARACTER[gender.toUpperCase() as 'MALE' | 'FEMALE'].length -
            1,
        })
      ) as string
    )
  }
  constructor(
    private _id: number,
    private name: string,
    public location: Building,
    private _spriteKey: string
  ) {
    makeAutoObservable(this)
  }

  get id() {
    return this._id
  }

  get spriteKey() {
    return this._spriteKey
  }
}
