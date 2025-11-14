import { Scene } from "phaser";
import { AssetKey } from "../types";

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
    this.load.image(AssetKey.Image.duck, "duck_yellow.png");
    this.load.image(AssetKey.Image.headWood, "head_wood.png");
    this.load.image(AssetKey.Image.stickWood, "stick_wood.png");
    this.load.audio(AssetKey.Sound.jump, "jump.wav");
    this.load.audio(AssetKey.Sound.scores, "scores.wav");
    this.load.audio(AssetKey.Sound.crash, "crash.wav");
    this.load.audio(AssetKey.Sound.duckcry, "duckcry.wav");
    this.load.font(AssetKey.Font.monogram, "monogram.ttf");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
