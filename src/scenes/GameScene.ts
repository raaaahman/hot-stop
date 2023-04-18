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
        const building = store.buildings.find(
          (building) => building.name === dropZone.name
        )
        building?.setAvailable(false)

        const character = store.characters.find(
          (character) => gameObject.name === 'character-' + character.id
        )
        if (character && building) {
          store.timeline.add({
            once: true,
            at: this.scene.scene.time.now + 450,
            target: dropZone,
            run: () => {
              building?.setAvailable(true)
              const counterBuilding = store.buildings.find(
                (building) => building.name === 'counter'
              )
              if (counterBuilding) {
                character.position = {
                  x:
                    counterBuilding.boundingRectangle.x +
                    gameObject.width * gameObject.originX,
                  y:
                    counterBuilding.boundingRectangle.y +
                    gameObject.width * gameObject.originY,
                }
              }
            },
          })

          character.position = {
            x:
              building.boundingRectangle.x +
              gameObject.width * gameObject.originX,
            y:
              building.boundingRectangle.y +
              gameObject.height * gameObject.originY,
          }
        }
      }
    )

    store.characters.push(new Character(0, 34 * 32, 24 * 32, SPRITE_GIRL_DARK))

    store.characters.forEach((character) => {
      const sprite = this.add
        .image(
          character.position.x,
          character.position.y,
          character.spriteKey,
          0
        )
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
        sprite.setX(character.position.x)
        sprite.setY(character.position.y)
      })
    })

    store.timeline.play()
  }
}
