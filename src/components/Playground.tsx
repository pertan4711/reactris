// The main panels in the game: ScoreBoard, Block (active block) and the wall
import Block from "./game/Block";
import Wall from "./game/Wall";
import { PlaygroundProps } from "../model/types";
import Boundary from "./board/Boundary";
import ScoreBoard from "./board/Score";

function Playground({
  blockBricks,
  settings,
  pause,
  newgame,
  pg,
}: PlaygroundProps) {
  const pwidth: number = pg.numColumns * pg.brickSpace;
  const pheight: number = pg.numRows * pg.brickSpace;

  return (
    <div>
      <Boundary xoffset={pwidth} height={pheight} />
      <ScoreBoard
        width={pwidth}
        height={pheight}
        settings={settings}
        pause={pause}
        newgame={newgame}
        pg={pg}
      />
      <div>
        {/* Active block */}
        <Block
          bricks={blockBricks}
          color={pg.activeBlock.getBlockColor()}
          numCol={pg.numColumns}
          brickSize={pg.brickSize}
          brickSpace={pg.brickSpace}
        />
        {/* Colored wall */}
        <Wall
          wall={pg.getWall()}
          numCol={pg.numColumns}
          numRow={pg.numRows}
          brickSize={pg.brickSize}
          brickSpace={pg.brickSpace}
        />
      </div>
    </div>
  );
}

export default Playground;
