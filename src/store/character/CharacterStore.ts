import { makeAutoObservable } from 'mobx'
import Character from './Character'

export default class CharacterStore {
  public selected?: Character
  private _characters: Character[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get length() {
    return this._characters.length
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
