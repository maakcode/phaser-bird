import Phaser from "phaser";
import { AssetKey } from "../types";

export class Pipe extends Phaser.GameObjects.Container {
  stick: Phaser.GameObjects.Sprite;
  head: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, reversed = false) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.head = scene.add
      .sprite(0, 0, AssetKey.Image.headWood)
      .setOrigin(0.5, 0);
    this.stick = scene.add
      .sprite(0, this.head.displayHeight, AssetKey.Image.stickWood)
      .setOrigin(0.5, 0);
    this.stick.scaleY = 3;

    this.add([this.stick, this.head]);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.immovable = true;
      this.body.setSize(
        this.head.displayWidth,
        this.head.displayHeight + this.stick.displayHeight
      );
      this.body.setOffset(-0.5 * this.body.width, 0);

      if (reversed) {
        this.angle = 180;
        this.body.setOffset(-0.5 * this.body.width, -this.body.height);
      }
    }
  }

  setLevel(level: number) {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocityX(-200 - 5 * level);
    }
  }

  preUpdate() {
    if (this.x + this.width < this.scene.cameras.main.worldView.left) {
      this.destroy();
    }
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}

export class ScoreArea extends Phaser.GameObjects.Container {
  area!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, gap: number) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.area = scene.add.rectangle(0, 0, 6, gap).setOrigin(0.5, 0.5);
    this.add([this.area]);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.immovable = true;
      this.body.setSize(this.area.displayWidth, this.area.displayHeight);
      this.body.setOffset(-0.5 * this.body.width, -0.5 * this.body.height);
    }
  }

  setLevel(level: number) {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocityX(-200 - 5 * level);
    }
  }

  preUpdate() {
    if (this.x + this.width < this.scene.cameras.main.worldView.left) {
      this.destroy();
    }
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}
