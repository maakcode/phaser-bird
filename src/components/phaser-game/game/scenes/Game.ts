import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Duck } from "../nodes/Duck";
import { Pipe, ScoreArea } from "../nodes/Pipe";
import { AssetKey } from "../types";

export class Game extends Scene {
  score = 0;
  duck!: Duck;
  scoreText!: Phaser.GameObjects.Text;
  pipeColliderGroup!: Phaser.GameObjects.Group;
  scoreColliderGroup!: Phaser.GameObjects.Group;
  spawnEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
    this.score = 0;
    this.duck = new Duck(this, 0.2 * width, 0.5 * height);

    this.pipeColliderGroup = this.add.group();
    this.scoreColliderGroup = this.add.group();

    this.spawnEvent = this.time.addEvent({
      delay: 1800,
      callback: this.addPipeRow,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.duck,
      this.pipeColliderGroup,
      this.changeScene,
      undefined,
      this
    );

    this.physics.add.collider(
      this.duck,
      this.scoreColliderGroup,
      this.addScore,
      undefined,
      this
    );

    this.scoreText = this.add
      .text(0.5 * width, 0.15 * height, "0", {
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

    EventBus.emit("current-scene-start", this);
  }

  update(time: number, delta: number): void {
    if (this.duck.y < 0 || this.duck.y > this.scale.height) {
      this.changeScene();
    }
  }

  private addPipeRow() {
    const { width, height } = this.scale;

    const gap = 245;
    const x = width + 50;
    const y = Phaser.Math.Between(0.5 * gap + 40, height - 0.5 * gap - 40);

    const bottomPipe = new Pipe(this, x, y + 0.5 * gap);
    const scoreArea = new ScoreArea(this, x, y, gap);
    const topPipe = new Pipe(this, x, y - 0.5 * gap, true);

    bottomPipe.setLevel(this.score);
    scoreArea.setLevel(this.score);
    topPipe.setLevel(this.score);

    this.pipeColliderGroup.add(bottomPipe);
    this.scoreColliderGroup.add(scoreArea);
    this.pipeColliderGroup.add(topPipe);
  }

  private addScore(object1: unknown, object2: unknown) {
    if (object1 instanceof ScoreArea) {
      object1.destroy();
    } else if (object2 instanceof ScoreArea) {
      object2.destroy();
    }

    this.score++;
    this.scoreText.setText(this.score.toString());

    if (this.score % 10 === 0) {
      this.sound.play(AssetKey.Sound.duckcry);
    } else {
      this.sound.play(AssetKey.Sound.scores);
    }

    this.spawnEvent.timeScale = 1 + 0.02 * this.score;
    this.pipeColliderGroup.children.iterate((child) => {
      if (child instanceof Pipe) {
        child.setLevel(this.score);
      }
      return true;
    });
    this.scoreColliderGroup.children.iterate((child) => {
      if (child instanceof ScoreArea) {
        child.setLevel(this.score);
      }
      return true;
    });
  }

  changeScene() {
    this.sound.play(AssetKey.Sound.crash);
    this.scene.start("GameOver", { score: this.score });
  }
}
