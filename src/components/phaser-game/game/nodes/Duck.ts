export class Duck extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "duck");
    scene.add.existing(this);
    scene.physics.add.existing(this);

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
    this.setVelocityY(-500);
  }
}
