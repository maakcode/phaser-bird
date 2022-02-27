import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  background: GameObjects.Image | null = null;
  logo: GameObjects.Image | null = null;
  title: GameObjects.Text | null = null;
  logoTween: Phaser.Tweens.Tween | null = null;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(320, 384, "background");
    this.logo = this.add.image(320, 380, "logo").setDepth(100).setInteractive();
    this.title = this.add
      .text(320, 520, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive();

    EventBus.emit("current-scene-ready", this);

    this.input.on(
      "gameobjectdown",
      (
        _pointer: unknown,
        gameObject: GameObjects.Image | GameObjects.Text | null
      ) => {
        console.log(gameObject === this.logo);
        if (gameObject === this.logo) {
          this.moveLogo();
        }
        if (gameObject === this.title) {
          this.changeScene();
        }
      },
      this
    );
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }

    this.scene.start("Game");
  }

  moveLogo() {
    if (this.logoTween) {
      if (this.logoTween.isPlaying()) {
        this.logoTween.pause();
      } else {
        this.logoTween.play();
      }
    } else {
      this.logoTween = this.tweens.add({
        targets: this.logo,
        y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
        yoyo: true,
        repeat: -1,
      });
    }
  }
}
