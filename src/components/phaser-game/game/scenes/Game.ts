import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  duck!: Phaser.GameObjects.Image;
  scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
    this.duck = this.add
      .image(0.2 * width, 0.5 * height, "duck")
      .setOrigin(0.5, 0.5);

    this.scoreText = this.add
      .text(0.5 * width, 0.15 * height, "0", {
        fontFamily: "sans-serif",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(100);

    this.input.on(
      "pointerdown",
      () => {
        this.changeScene();
      },
      this
    );

    EventBus.emit("current-scene-start", this);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
