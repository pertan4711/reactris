// The main panels in the game: ScoreBoard, Block (active block) and the wall
import Block from "./game/Block";
import Wall from "./game/Wall";
import { PlaygroundProps } from "../model/types";
import Boundary from "./board/Boundary";
import ScoreBoard from "./board/Score";
import { getSetting } from "../utils/utils";

function Playground({
  blockBricks,
  gameStatus,
  actionCallbacks,
  pg,
}: PlaygroundProps) {
  const brickSpace = getSetting(pg, "brickSpace");
  const brickSize = getSetting(pg, "brickSize");
  const numColumns = getSetting(pg, "numColumns");
  const numRows = getSetting(pg, "numRows");

  const pwidth: number = pg.numColumns * brickSpace;
  const pheight: number = pg.numRows * brickSpace;

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
          numCol={numColumns}
          brickSize={brickSize}
          brickSpace={brickSpace}
        />
        {/* Colored wall */}
        <Wall
          wall={pg.getWall()}
          numCol={numColumns}
          numRow={numRows}
          brickSize={brickSize}
          brickSpace={brickSpace}
        />
      </div>
    </div>
  );
}

export default Playground;
