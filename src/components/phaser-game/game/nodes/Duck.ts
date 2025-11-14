import { AssetKey } from "../types";

export class Duck extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, AssetKey.Image.duck);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.immovable = true;
      this.body.setCircle(0.49 * this.displayWidth);
    }

    scene.input.on(
      "pointerdown",
      () => {
        this._jump();
      },
      this
    );
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const v = Math.asin(
      Math.min(Math.max(-500, this.body?.velocity.y ?? 0), 500) / 700
    );

    this.setAngle((v * 180) / Math.PI);
  }

  _jump() {
    this.scene.sound.play(AssetKey.Sound.jump);
    this.setVelocityY(-500);
  }
}
