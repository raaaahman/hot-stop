import { makeObservable, override } from 'mobx'
import Building from './Building'

export default class RubblePile extends Building {
  constructor(
    _name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    private duration: number,
    private reward: Record<string, any>
  ) {
    super(_name, 'rubble', x, y, width, height, true)
    makeObservable(this, {
      onComplete: override,
    })
  }

  createTask(elapsed: number) {
    return super.createTask(elapsed + this.duration)
  }

  onComplete() {
    return Object.assign({}, this.reward)
  }
}
