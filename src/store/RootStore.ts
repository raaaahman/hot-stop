import { action, makeObservable, observable } from 'mobx'

import Building from './building/Building'
import Character from './character/Character'

export default class RootStore {
  public timeline: Phaser.Time.Timeline
  public buildings: Building[]
  public characters: Character[]

  constructor(
    timeline: Phaser.Time.Timeline,
    objectLayer: Phaser.Tilemaps.ObjectLayer
  ) {
    this.timeline = makeObservable(timeline, {
      events: observable,
      add: action,
    })
    this.buildings = observable(Building.createFromObjects(objectLayer))
    this.characters = observable<Character>([])
  }
}
