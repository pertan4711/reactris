// The main panels in the game: ScoreBoard, Block (active block) and the wall
import Block from "./game/Block";
import Wall from "./game/Wall";
import { PlaygroundProps } from "../model/componentProps";
import Boundary from "./board/Boundary";
import ScoreBoard from "./board/Score";

function Playground({
  blockBricks,
  gameStatus,
  gameSettings,
  actionCallbacks,
  pg,
}: PlaygroundProps) {
  const pwidth: number = pg.numColumns * gameSettings.brickSpace;
  const pheight: number = pg.numRows * gameSettings.brickSpace;

  return (
    <div>
      <Boundary xoffset={pwidth} height={pheight} />
      <ScoreBoard
        width={pwidth}
        height={pheight}
        gameStatus={gameStatus}
        actionCallbacks={actionCallbacks}
        pg={pg}
      />
      <div>
        {/* Active block */}
        <Block
          bricks={blockBricks}
          color={pg.activeBlock.getBlockColor()}
          numCol={pg.numColumns}
          brickSize={gameSettings.brickSize}
          brickSpace={gameSettings.brickSpace}
        />
        {/* Colored wall */}
        <Wall
          wall={pg.getWall()}
          numCol={pg.numColumns}
          numRow={pg.numRows}
          brickSize={gameSettings.brickSize}
          brickSpace={gameSettings.brickSpace}
        />
      </div>
    </div>
  );
}

export default Playground;
