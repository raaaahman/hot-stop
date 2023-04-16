import { Scene } from 'phaser'
import { action, autorun, makeObservable, observable } from 'mobx'

import { MAP_ROAD_360, SPRITE_GIRL_DARK, TILEMAP_ROAD_360 } from '../resources'

export default class GameScene extends Scene {
  preload () {
    this.load.image(MAP_ROAD_360, 'assets/img/road_360.png')
    this.load.spritesheet(SPRITE_GIRL_DARK, 'assets/img/GirlDarkExample.png', { frameWidth: 36, frameHeight: 40 })
    this.load.json(TILEMAP_ROAD_360, 'assets/levels/road_360.json')
  }

  create () {
    this.add.image(this.scale.width / 2, this.scale.height / 2, MAP_ROAD_360)

    const eventStore = makeObservable(
      this.add.timeline([]),
      {
        events: observable,
        add: action
      }
    )

    const disposeEventsUpdate = autorun(() => {
      console.log(eventStore.events.length, eventStore.events.map(event => event.target.name))
    })

    const zones = this.add.group()
    const objectsLayer = this.cache.json.get(TILEMAP_ROAD_360).layers.find((layer: Phaser.Tilemaps.TilemapLayer) => layer.name === 'rooms') as Phaser.Tilemaps.ObjectLayer
    objectsLayer.objects.forEach(obj => {
      if (obj.x && obj.y && obj.width && obj.height) {
        zones.add(
          this.add.zone(obj.x, obj.y, obj.width, obj.height)
            .setOrigin(0)
            .setRectangleDropZone(obj.width, obj.height)
            .setName(obj.name)
        )
      }
    })

    this.input.on(Phaser.Input.Events.DRAG_ENTER, (
      pointer: Phaser.Input.Pointer,
      gameObject: Phaser.GameObjects.GameObject,
      dropZone: Phaser.GameObjects.Zone
    ) => {
      console.log('enter ', dropZone.name)
    })

    this.input.on(Phaser.Input.Events.DRAG_LEAVE, (
      pointer: Phaser.Input.Pointer,
      gameObject: Phaser.GameObjects.GameObject,
      dropZone: Phaser.GameObjects.Zone
    ) => {
      console.log('leave ', dropZone.name)
    })

    this.input.on(Phaser.Input.Events.DROP, (
      pointer: Phaser.Input.Pointer,
      gameObject: Phaser.GameObjects.GameObject,
      dropZone: Phaser.GameObjects.Zone) => {
      eventStore.add({
        once: true,
        at: this.scene.scene.time.now + 450,
        target: dropZone
      })
    })

    this.add.image(36 * 32, 24 * 32, SPRITE_GIRL_DARK, 0)
      .setInteractive({
        draggable: true
      })
      .on(Phaser.Input.Events.DRAG, function (
        pointer: Phaser.Input.Pointer,
        dragX: number,
        dragY: number
      ) {
        const self = this as Phaser.GameObjects.Image
        self.setX(dragX)
        self.setY(dragY)
      })

    eventStore.play()
  }
}
