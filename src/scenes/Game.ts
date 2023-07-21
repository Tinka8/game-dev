import Phaser from 'phaser'

import { debugDraw } from '../utils/debug'
import { createLizzardAnims } from '../anims/EnemyAnims'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Phaser.Physics.Arcade.Sprite
	constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    const wallsLayer = map.createLayer('Walls',(tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer
    const groundLayer = map.createLayer("Ground", tileset as Phaser.Tilemaps.Tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;

    wallsLayer.setCollisionByProperty({ collides: true })

    // debugDraw(wallsLayer, this)

    this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png')
    this.faune.body?.setSize(this.faune.width * 0.5, this.faune.height * 0.8)

    this.anims.create({
      key: 'faune-idle-down',
      frames: [{ key: 'faune', frame: 'walk-down-3.png'}]
    })

    this.anims.create({
      key: 'faune-idle-up',
      frames: [{ key: 'faune', frame: 'walk-up-lift-3.png'}]
    })

    this.anims.create({
      key: 'faune-idle-side',
      frames: [{ key: 'faune', frame: 'run-side-3.png'}]
    })

    this.anims.create({
      key: 'faune-run-down',
      frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png'}),
      repeat: -1,
      frameRate: 15,
    })

    this.anims.create({
      key: 'faune-run-up',
      frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png'}),
      repeat: -1,
      frameRate: 15,
    })

    this.anims.create({
      key: 'faune-run-side',
      frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png'}),
      repeat: -1,
      frameRate: 15,
    })

    this.faune.anims.play('faune-idle-down')

    this.physics.add.collider(this.faune, wallsLayer)

    this.cameras.main.startFollow(this.faune, true)

    const lizard = this.physics.add.sprite(256, 128, 'lizard', 'lizard_m_idle_anim_f0.png')

    createLizzardAnims(this.anims)

    lizard.anims.play('lizard-run')
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.faune) {
      return
    }

    const speed = 100
    if (this.cursors.left?.isDown) {
      this.faune.anims.play('faune-run-side', true)
      this.faune.setVelocity(-speed, 0)

      this.faune.scaleX = - 1
      this.faune.body.offset.x = 24
    }

    else if (this.cursors.right?.isDown) {
      this.faune.anims.play('faune-run-side', true)
      this.faune.setVelocity(speed, 0)

      this.faune.scaleX = 1
      this.faune.body.offset.x = 8
    }

    else if (this.cursors.up?.isDown) {
      this.faune.anims.play('faune-run-up', true)
      this.faune.setVelocity(0, -speed)
    }

    else if (this.cursors.down?.isDown) {
      this.faune.anims.play('faune-run-down', true)
      this.faune.setVelocity(0, speed)
    
    }

    else {
      const parts = this.faune.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.faune.play(parts.join('-'))
      this.faune.setVelocity(0, 0)
    }
  }
}
