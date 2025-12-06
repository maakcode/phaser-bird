import { Scene } from "phaser";
import { EventBus, EventKey } from "../EventBus";
import { Duck } from "../nodes/Duck";
import { Pipe } from "../nodes/Pipe";
import { AssetKey } from "../types";
import { Coin } from "../nodes/Coin";

export class Game extends Scene {
  score = 0;
  spawnIndex = 0;
  duck!: Duck;
  scoreText!: Phaser.GameObjects.Text;
  pipeColliderGroup!: Phaser.GameObjects.Group;
  scoreColliderGroup!: Phaser.GameObjects.Group;
  pipeSpawnEvent!: Phaser.Time.TimerEvent;
  coinSpawnEvent!: Phaser.Time.TimerEvent;
  starEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
    this.score = 0;
    this.spawnIndex = 0;
    this.duck = new Duck(this, 0.2 * width, 0.5 * height);

    this.pipeColliderGroup = this.add.group();
    this.scoreColliderGroup = this.add.group();

    this.anims.create({
      key: AssetKey.Animation.coinFlip,
      frames: this.anims.generateFrameNumbers(AssetKey.Image.coin, {
        start: 0,
        end: 6,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.starEmitter = this.add.particles(0, 0, AssetKey.Image.star, {
      lifespan: 500,
      speed: { min: 400, max: 650 },
      angle: { min: -100, max: 100 },
      alpha: { start: 1, end: 0 },
      emitting: false,
    });

    this.pipeSpawnEvent = this.time.addEvent({
      delay: 1800,
      callback: this.addPipeRow,
      callbackScope: this,
      loop: true,
    });

    this.coinSpawnEvent = this.time.addEvent({
      startAt: 900,
      delay: 1800,
      callback: this.addCoin,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.duck,
      this.pipeColliderGroup,
      this.changeScene,
      undefined,
      this
    );

    this.physics.add.overlap(
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

    EventBus.emit(EventKey.GameStart);
  }

  update(time: number, delta: number): void {
    if (this.duck.y < 0 || this.duck.y > this.scale.height) {
      this.changeScene();
    }
  }

  private addCoin() {
    const { width, height } = this.scale;
    const x = width + 50;
    const y =
      this.spawnIndex === 0
        ? height / 2
        : Phaser.Math.Between(100, height - 100);

    const coin = new Coin(this, x, y);
    coin.setLevel(this.spawnIndex);

    this.scoreColliderGroup.add(coin);
  }

  private addPipeRow() {
    const { width, height } = this.scale;

    const gap = 245 - Math.min(this.spawnIndex, 30) * 2;
    const x = width + 50;
    const y =
      this.spawnIndex === 0
        ? height / 2
        : Phaser.Math.Between(0.5 * gap + 40, height - 0.5 * gap - 40);

    const bottomPipe = new Pipe(this, x, y + 0.5 * gap);
    const topPipe = new Pipe(this, x, y - 0.5 * gap, true);

    bottomPipe.setLevel(this.spawnIndex);
    topPipe.setLevel(this.spawnIndex);

    this.pipeColliderGroup.add(bottomPipe);
    this.pipeColliderGroup.add(topPipe);
    this.pipeSpawnEvent.timeScale = 1 + 0.02 * this.spawnIndex;
    this.coinSpawnEvent.timeScale = 1 + 0.02 * this.spawnIndex;
    this.pipeColliderGroup.children.iterate((child) => {
      if (child instanceof Pipe) {
        child.setLevel(this.spawnIndex);
      }
      return true;
    });
    this.scoreColliderGroup.children.iterate((child) => {
      if (child instanceof Coin) {
        child.setLevel(this.spawnIndex);
      }
      return true;
    });
    this.spawnIndex++;
  }

  private addScore(object1: unknown, object2: unknown) {
    const position = {
      x: this.duck.x,
      y: this.duck.y,
    };

    if (object1 instanceof Coin) {
      object1.destroy();
      position.x = object1.x;
      position.y = object1.y;
    } else if (object2 instanceof Coin) {
      object2.destroy();
      position.x = object2.x;
      position.y = object2.y;
    }

    this.starEmitter.emitParticle(8, position.x, position.y);

    this.score++;
    this.scoreText.setText(this.score.toString());

    if (this.score % 10 === 0) {
      this.sound.play(AssetKey.Sound.duckcry);
    } else {
      this.sound.play(AssetKey.Sound.scores);
    }
  }

  changeScene() {
    this.sound.play(AssetKey.Sound.crash);
    this.scene.start("GameOver", { score: this.score });
  }
}
