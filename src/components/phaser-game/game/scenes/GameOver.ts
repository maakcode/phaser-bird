import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { AssetKey } from "../types";

export class GameOver extends Scene {
  score!: number;
  camera!: Phaser.Cameras.Scene2D.Camera;
  gameOverText!: Phaser.GameObjects.Text;
  scoreText!: Phaser.GameObjects.Text;
  helperText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  init(data: { score: number }) {
    this.score = data.score;
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

    this.scoreText = this.add
      .text(0.5 * width, 0.15 * height, `${this.score}`, {
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

    this.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 600,
      ease: "Sine.easeOut",
      onUpdate: (tween) => {
        const redValue = tween.getValue() ?? 0;
        const color = Phaser.Display.Color.GetColor(redValue, 0, 0);
        this.camera.setBackgroundColor(color);
      },
      onComplete: () => {
        this.input.on(
          "pointerdown",
          () => {
            this.changeScene();
          },
          this
        );
      },
    });

    EventBus.emit("current-scene-end", this);
  }

  changeScene() {
    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      ease: "Sine.easeIn",
      onUpdate: (tween) => {
        const progress = (tween.getValue() ?? 0) / 100;
        const color = Phaser.Display.Color.GetColor(
          0x02 * progress,
          0x8a * progress,
          0xf8 * progress
        );
        this.camera.setBackgroundColor(color);
      },
      onComplete: () => {
        this.scene.start("MainMenu");
      },
    });
  }
}
