import Phaser from "phaser";
import { AssetKey } from "../types";

export class Coin extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, AssetKey.Image.coin);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(AssetKey.Animation.coinFlip);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.immovable = true;
      this.body.setSize(this.displayWidth, this.displayHeight);
    }
  }

  setLevel(level: number) {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocityX(-200 - 5 * level);
    }
  }

  update(): void {
    if (this.x + this.width < this.scene.cameras.main.worldView.left) {
      this.destroy();
    }
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}
