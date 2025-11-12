import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    const { width, height } = this.scale;

    this.add
      .rectangle(0.5 * width, 0.5 * height, 0.8 * width, 32)
      .setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(0.5 * width, 0.5 * height, 4, 28, 0xffffff);

    this.load.on("progress", (progress: number) => {
      bar.displayWidth = Math.max(4, 0.8 * width * progress - 4);
    });
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("duck", "duck_yellow.png");
    this.load.image("head_wood", "head_wood.png");
    this.load.image("stick_wood", "stick_wood.png");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
