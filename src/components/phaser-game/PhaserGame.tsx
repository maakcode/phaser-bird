import { useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./game/main";
import { EventBus, EventKey } from "./game/EventBus";

interface Props {
  className?: HTMLDivElement["className"];
  onGameEnd?: (score: number) => void;
}

export default function PhaserGame({ className, onGameEnd }: Props) {
  const game = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container");
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, []);

  useEffect(() => {
    EventBus.on(EventKey.GameEnd, (score: number) => {
      onGameEnd?.(score);
    });
    return () => {
      EventBus.removeListener(EventKey.GameEnd);
    };
  }, [onGameEnd]);

  return <div id="game-container" className={className}></div>;
}
