import { Scene } from 'phaser'
import { action, autorun, extendObservable, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'

import { MAP_ROAD_360, SPRITE_GIRL_DARK, TILEMAP_ROAD_360 } from '../resources'
import BuildingStore from '../store/Building/BuildingStore'

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

    const buildingStore = BuildingStore.createFromObjects(this.cache.json.get(TILEMAP_ROAD_360).layers.find((layer: Phaser.Tilemaps.TilemapLayer) => layer.name === 'rooms'))

    const zones = this.add.group()
    buildingStore.buildings.forEach(
      obj => {
        const zone = this.add.rectangle(
          obj.boundingRectangle.x,
          obj.boundingRectangle.y,
          obj.boundingRectangle.width,
          obj.boundingRectangle.height,
          0x000000)
          .setOrigin(0)
          .setInteractive({ dropZone: true })
          .setName(obj.name)

        zones.add(zone)
      }
    )

    autorun(() => {
      buildingStore.buildings.forEach(
        building => {
          const zone = zones.getChildren().find(zone => zone.name === building.name) as Phaser.GameObjects.Rectangle
          if (building.isAvailable) {
            zone.setInteractive()
            zone.setAlpha(0.01)
          } else {
            console.log('disable')
            zone.disableInteractive()
            zone.setAlpha(0.3)
          }
        }
      )
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
      buildingStore.buildings.find(building => building.name === dropZone.name)?.setAvailable(false)
      eventStore.add({
        once: true,
        at: this.scene.scene.time.now + 450,
        target: dropZone,
        run: () => buildingStore.buildings.find(building => building.name === dropZone.name)?.setAvailable(true)
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
