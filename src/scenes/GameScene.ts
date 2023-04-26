import { Scene } from 'phaser'
import { autorun } from 'mobx'
import { Chance } from 'chance'

import { MAP_ROAD_360, SPRITE_CHARACTER, TILEMAP_ROAD_360 } from '../resources'
import Character from '../store/character/Character'
import RootStore from '../store/RootStore'

export default class GameScene extends Scene {
  preload() {
    this.load.image(MAP_ROAD_360, 'assets/img/road_360.png')
    SPRITE_CHARACTER.MALE.forEach((filename) =>
      this.load.spritesheet(filename, `assets/img/${filename}.png`, {
        frameWidth: 36,
        frameHeight: 40,
      })
    )
    SPRITE_CHARACTER.FEMALE.forEach((filename) =>
      this.load.spritesheet(filename, `assets/img/${filename}.png`, {
        frameWidth: 36,
        frameHeight: 40,
      })
    )
    this.load.json(TILEMAP_ROAD_360, 'assets/levels/road_360.json')
  }

  create() {
    const chance = new Chance()
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
        const characterIdMatch = gameObject.name.match(/character-(\d+)/)
        if (characterIdMatch) {
          store.assign(dropZone.name, Number(characterIdMatch[1]))
        }
      }
    )

    const characterSprites = this.add.group({
      classType: Phaser.GameObjects.Image,
    })

    autorun(() => {
      store.characters.forEach((character) => {
        if (
          characterSprites.getMatching('name', 'character-' + character.id)
            .length === 0
        ) {
          const sprite = characterSprites.getFirstDead(
            true
          ) as Phaser.GameObjects.Image
          sprite
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
            sprite.setX(
              (character.location?.boundingRectangle.x || -800) +
                sprite.width / 2
            )
            sprite.setY(
              (character.location?.boundingRectangle.y || -800) +
                sprite.height / 2
            )
          })
          autorun(() => {
            if (character.isActive) {
              const gender =
                (character?.gender?.toUpperCase() as 'MALE' | 'FEMALE') ||
                'MALE'
              sprite
                .setTexture(
                  SPRITE_CHARACTER[gender].at(
                    chance.integer({
                      min: 0,
                      max: SPRITE_CHARACTER[gender].length,
                    })
                  ) as string
                )
                .setX(-800)
                .setY(-800)
                .setActive(true)
                .setVisible(true)
            } else {
              characterSprites.killAndHide(sprite)
            }
          })
        }
      })
    })

    store.timeline.play()
  }
}
