import { Scene } from 'phaser'
import { autorun } from 'mobx'
import { Chance } from 'chance'

import {
  MAP_ROAD_360,
  SPRITE_CHARACTER,
  SPRITE_ITEMS,
  TILEMAP_ROAD_360,
} from '../resources'
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
    this.load.image(SPRITE_ITEMS.NOTE, 'assets/img/note.png')
    this.load.image(SPRITE_ITEMS.PLATE, 'assets/img/plate.png')
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
    store.init()
    this.add.image(this.scale.width / 2, this.scale.height / 2, MAP_ROAD_360)

    const zones = this.add.group()
    store.buildings.forEach((building) => {
      const zone = this.add
        .rectangle(
          building.boundingRectangle.x,
          building.boundingRectangle.y,
          building.boundingRectangle.width,
          building.boundingRectangle.height,
          0x000000
        )
        .setOrigin(0)
        .setInteractive({ dropZone: true })
        .setName(building.name)

      autorun(() => {
        console.log(building.name, 'available: ', building.available)
        if (building.available) {
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
      Phaser.Input.Events.DROP,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        const characterIdMatch = gameObject.name.match(/character-(\d+)/)
        if (characterIdMatch) {
          store.assignCharacter(dropZone.name, Number(characterIdMatch[1]))
        }
        const orderIdMatch = gameObject.name.match(/order-(\d+)/)
        if (orderIdMatch) {
          store.assignOrder(dropZone.name, Number(orderIdMatch[1]))
        }
        console.log(characterIdMatch, orderIdMatch)
      }
    )

    const sprites = this.add.group({
      classType: Phaser.GameObjects.Image,
    })

    autorun(() => {
      store.characters.forEach((character) => {
        if (
          sprites.getMatching('name', 'character-' + character.id).length === 0
        ) {
          const sprite = sprites.getFirstDead(true) as Phaser.GameObjects.Image
          sprite
            .setName('character-' + character.id)
            .setInteractive({
              draggable: true,
            })
            .on(
              Phaser.Input.Events.DRAG,
              (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                sprite.setX(dragX)
                sprite.setY(dragY)
              }
            )
            .on(
              Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
              (
                pointer: Phaser.Input.Pointer,
                x: number,
                y: number,
                event: Phaser.Types.Input.EventData
              ) => {
                const characterIdMatch = sprite.name.match(/character-(\d+)/)
                if (characterIdMatch) {
                  const character = store.characters.findById(
                    Number(characterIdMatch[1])
                  )
                  store.characters.selected = character
                }
                event.stopPropagation()
              }
            )

          autorun(() => {
            console.log(character.id, character.name, character.location?.name)
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
                      max: SPRITE_CHARACTER[gender].length - 1,
                    })
                  ) as string
                )
                .setX(-800)
                .setY(-800)
                .setActive(true)
                .setVisible(true)
            } else {
              sprites.killAndHide(sprite)
            }
          })
        }
      })
    })

    autorun(() => {
      store.orders.forEach((order) => {
        if (sprites.getMatching('name', 'order-' + order.id).length === 0) {
          const sprite = sprites.getFirstDead(true) as Phaser.GameObjects.Image
          sprite
            .setName('order-' + order.id)
            .setInteractive({ draggable: true })
            .on(
              Phaser.Input.Events.DRAG,
              (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                sprite.setX(dragX)
                sprite.setY(dragY)
              }
            )

          autorun(() => {
            console.log(order.id, order.type, order.location?.name)
            sprite.setX(
              (order.location?.boundingRectangle.x || -800) + sprite.width * 2
            )
            sprite.setY(
              order.location?.boundingRectangle.y || -800 + sprite.height / 2
            )
          })

          autorun(() => {
            console.log(order.id, order.type, order.from.name)
            if (order.active) {
              sprite
                .setTexture(
                  order.type === 'cook' ? SPRITE_ITEMS.NOTE : SPRITE_ITEMS.PLATE
                )
                .setX(
                  (order.from.location?.boundingRectangle.x || -800) +
                    sprite.width * 2
                )
                .setY(
                  (order.from.location?.boundingRectangle.y || -800) +
                    sprite.height / 2
                )
                .setActive(true)
                .setVisible(true)
            } else {
              sprites.killAndHide(sprite)
            }
          })
        }
      })
    })

    const characterName = this.add
      .text(1080, 40, '', { color: '#fff', fontStyle: 'bold' })
      .setVisible(false)
    const characterWants = this.add
      .text(1080, 52, '', { color: '#fff' })
      .setVisible(false)
    autorun(() => {
      if (store.characters.selected) {
        characterName.text = store.characters.selected.name
        characterName.setVisible(true)

        characterWants.text =
          store.characters.selected.wants.length > 0
            ? 'Wants: ' + store.characters.selected.wants[0]?.type
            : ''
        characterWants.setVisible(true)
      } else {
        characterName.text = ''
        characterName.setVisible(false)

        characterWants.text = ''
        characterWants.setVisible(false)
      }
    })

    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        store.characters.selected = undefined
      }
    )

    const moneyText = this.add.text(40, 40, '', { color: '#fff' })

    autorun(() => {
      moneyText.text = `Money: ${Math.floor(store.inventory.money)}$`
    })

    store.timeline.play()
  }
}
