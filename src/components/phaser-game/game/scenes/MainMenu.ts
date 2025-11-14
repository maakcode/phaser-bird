import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { AssetKey } from "../types";

export class MainMenu extends Scene {
  duck!: Phaser.GameObjects.Image;
  title!: Phaser.GameObjects.Text;
  helperText!: Phaser.GameObjects.Text;
  duckTween!: Phaser.Tweens.Tween;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;
    this.duck = this.add
      .image(0.5 * width, 0.5 * height + 15, AssetKey.Image.duck)
      .setOrigin(0.5, 0.5);

    this.title = this.add
      .text(0.5 * width, 0.3 * height, "Phaser Duck", {
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
      .text(0.5 * width, 0.7 * height, "Click to start", {
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

    this.duckTween = this.tweens.add({
      targets: this.duck,
      y: { value: "-=30", duration: 500, ease: "Sine.easeInOut" },
      angle: {
        start: 0,
        from: -30,
        to: 30,
        duration: 1000,
        ease: "Sine.easeInOut",
      },
      yoyo: true,
      repeat: -1,
    });

    this.input.on(
      "pointerdown",
      () => {
        this.changeScene();
      },
      this
    );

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    const { width, height } = this.scale;
    this.duckTween.remove();

    this.tweens.add({
      targets: this.title,
      alpha: 0,
      duration: 200,
      ease: "Sine.easeOut",
    });

    this.tweens.add({
      targets: this.helperText,
      alpha: 0,
      duration: 200,
      ease: "Sine.easeOut",
    });

    this.tweens.add({
      targets: this.duck,
      x: 0.2 * width,
      y: 0.5 * height,
      angle: 0,
      duration: 1000,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.start("Game");
      },
    });
  }
}
