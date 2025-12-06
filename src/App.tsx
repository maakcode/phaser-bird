import { useState } from "react";
import PhaserGame from "./components/phaser-game/PhaserGame";

export default function App() {
  const [maxScore, setMaxScore] = useState(0);
  const [numberOfGames, setNumberOfGames] = useState(0);

  const handleGameEnd = (score: number) => {
    setNumberOfGames(numberOfGames + 1);
    if (score > maxScore) {
      setMaxScore(score);
    }
  };

  return (
    <div className="h-full py-8">
      <div className="flex justify-center gap-4">
        <span className="text-center mb-2">Max Score: {maxScore}</span>
        <span className="text-center mb-2">
          Number of games: {numberOfGames}
        </span>
      </div>
      <PhaserGame onGameEnd={handleGameEnd} />
    </div>
  );
}
