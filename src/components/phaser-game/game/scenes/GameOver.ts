import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
  camera!: Phaser.Cameras.Scene2D.Camera;
  gameOverText!: Phaser.GameObjects.Text;
  helperText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create() {
    const { width, height } = this.scale;
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);

    this.gameOverText = this.add
      .text(0.5 * width, 0.3 * height, "Game Over", {
        fontFamily: "sans-serif",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(100);

    this.helperText = this.add
      .text(0.5 * width, 0.7 * height, "Click to main menu", {
        fontFamily: "sans-serif",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
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

    EventBus.emit("current-scene-end", this);
  }

  changeScene() {
    this.scene.start("MainMenu");
  }
}
