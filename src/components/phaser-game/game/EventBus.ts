import { Events } from "phaser";

export const EventKey = {
  GameReady: "game-ready",
  GameStart: "game-start",
  GameEnd: "game-end",
} as const;

export const EventBus = new Events.EventEmitter();
