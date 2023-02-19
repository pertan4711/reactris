import { GameOverProps, HighScoreProps } from "../../model/types";

const HighScore = ({ highscoreList }: HighScoreProps) => {
  return (
    <div>
      <div>HighScores</div>
      <div>1. Pertan 9999</div>
      <div>2. Pertan 1002</div>
      <div>2. Pertan 834</div>
      <div>2. Pertan 134</div>
    </div>
  );
};

export default HighScore;
