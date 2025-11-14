import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { AssetKey } from "../types";

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
        fontFamily: AssetKey.Font.monogram,
        fontSize: 192,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
      .setDepth(100);

    this.helperText = this.add
      .text(0.5 * width, 0.7 * height, "Click to main menu", {
        fontFamily: AssetKey.Font.monogram,
        fontSize: 96,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
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
