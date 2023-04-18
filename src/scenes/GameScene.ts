import { Scene } from 'phaser'
import { autorun } from 'mobx'

import { MAP_ROAD_360, SPRITE_GIRL_DARK, TILEMAP_ROAD_360 } from '../resources'
import Character from '../store/character/Character'
import RootStore from '../store/RootStore'

export default class GameScene extends Scene {
  preload() {
    this.load.image(MAP_ROAD_360, 'assets/img/road_360.png')
    this.load.spritesheet(SPRITE_GIRL_DARK, 'assets/img/GirlDarkExample.png', {
      frameWidth: 36,
      frameHeight: 40,
    })
    this.load.json(TILEMAP_ROAD_360, 'assets/levels/road_360.json')
  }

  create() {
    const store = new RootStore(
      this.add.timeline([]),
      this.cache.json
        .get(TILEMAP_ROAD_360)
        .layers.find(
          (layer: Phaser.Tilemaps.TilemapLayer) => layer.name === 'rooms'
        )
    )
    this.add.image(this.scale.width / 2, this.scale.height / 2, MAP_ROAD_360)

    const disposeEventsUpdate = autorun(() => {
      console.log(
        store.timeline.events.length,
        store.timeline.events.map((event) => event.target.name)
      )
    })

    const zones = this.add.group()
    store.buildings.forEach((obj) => {
      console.log(obj.name)
      const zone = this.add
        .rectangle(
          obj.boundingRectangle.x,
          obj.boundingRectangle.y,
          obj.boundingRectangle.width,
          obj.boundingRectangle.height,
          0x000000
        )
        .setOrigin(0)
        .setInteractive({ dropZone: true })
        .setName(obj.name)

      autorun(() => {
        if (obj.isAvailable) {
          zone.setInteractive()
          zone.setAlpha(0.01)
        } else {
          zone.disableInteractive()
          zone.setAlpha(0.3)
        }
      })
      zones.add(zone)
    })

    this.input.on(
      Phaser.Input.Events.DRAG_ENTER,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        console.log('enter ', dropZone.name)
      }
    )

    this.input.on(
      Phaser.Input.Events.DRAG_LEAVE,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        console.log('leave ', dropZone.name)
      }
    )

    this.input.on(
      Phaser.Input.Events.DROP,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        store.assign(dropZone, gameObject)
      }
    )

    const counter = store.buildings.find(
      (building) => building.name === 'counter'
    )
    if (counter) {
      store.characters.push(new Character(0, counter, SPRITE_GIRL_DARK))
    }

    store.characters.forEach((character) => {
      const sprite = this.add
        .image(0, 0, character.spriteKey, 0)
        .setName('character-' + character.id)
        .setInteractive({
          draggable: true,
        })
        .on(
          Phaser.Input.Events.DRAG,
          function (
            pointer: Phaser.Input.Pointer,
            dragX: number,
            dragY: number
          ) {
            const self = this as Phaser.GameObjects.Image
            self.setX(dragX)
            self.setY(dragY)
          }
        )

      autorun(() => {
        sprite.setX(character.location.boundingRectangle.x + sprite.width / 2)
        sprite.setY(character.location.boundingRectangle.y + sprite.height / 2)
      })
    })

    store.timeline.play()
  }
}
