import { Game } from 'phaser'
import GameScene from './scenes/GameScene'

const game = new Game({
  parent: 'game',
  type: Phaser.AUTO,
  width: 1280,
  height: 960,
  scene: [GameScene]
})
