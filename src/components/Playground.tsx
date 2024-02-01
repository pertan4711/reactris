// The main panels in the game: ScoreBoard, Block (active block) and the wall
import Block from "./game/Block";
import Wall from "./game/Wall";
import { PlaygroundProps } from "../model/types";
import Boundary from "./board/Boundary";
import ScoreBoard from "./board/Score";

function Playground({
  blockBricks,
  gameStatus,
  actionCallbacks,
  pg,
}: PlaygroundProps) {
  const pwidth: number = pg.numColumns * pg.gameSettings.brickSpace;
  const pheight: number = pg.numRows * pg.gameSettings.brickSpace;

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
          numCol={pg.gameSettings.numColumns}
          brickSize={pg.gameSettings.brickSize}
          brickSpace={pg.gameSettings.brickSpace}
        />
        {/* Colored wall */}
        <Wall
          wall={pg.getWall()}
          numCol={pg.gameSettings.numColumns}
          numRow={pg.gameSettings.numRows}
          brickSize={pg.gameSettings.brickSize}
          brickSpace={pg.gameSettings.brickSpace}
        />
      </div>
    </div>
  );
}

export default Playground;
