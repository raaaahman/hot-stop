import { makeAutoObservable } from 'mobx'
import { Chance } from 'chance'

import Character from './Character'
import { CharacterWants } from './types'

export default class CharacterStore {
  static chance = new Chance()
  public selected?: Character
  private _characters: Character[] = []

  constructor() {
    makeAutoObservable(this)
  }

  create() {
    const character =
      this._characters.find((character) => character.isActive === false) ||
      new Character(this._characters.length + 1)
    character.gender = CharacterStore.chance.gender().toLowerCase() as
      | 'male'
      | 'female'
    character.name = CharacterStore.chance.name({
      gender: character.gender,
    })
    character.wants = CharacterWants[
      CharacterStore.chance.integer({ min: 0, max: 1 })
    ] as unknown as CharacterWants

    this._characters.push(character)

    return character
  }

  get length() {
    return this._characters.length
  }

  findById(characterId: number) {
    return this._characters.find((character) => character.id === characterId)
  }

  find(
    callback: (
      character: Character,
      index: integer,
      array: Character[]
    ) => boolean
  ) {
    return this._characters.find(callback)
  }

  push(character: Character) {
    this._characters.push(character)
  }

  forEach(
    callback: (character: Character, index: integer, array: Character[]) => void
  ) {
    this._characters.forEach(callback)
  }
}
