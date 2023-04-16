import { Game } from 'phaser'
import { configure } from 'mobx'

import GameScene from './scenes/GameScene'

configure({
  enforceActions: 'never'
})

const game = new Game({
  parent: 'game',
  type: Phaser.AUTO,
  width: 1280,
  height: 960,
  scene: [GameScene]
})
