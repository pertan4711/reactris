import React from "react";
import Brick from "./Brick";
import { WallProps } from "../../model/types";
import { blocks, emptyWallBrick } from "../../model/constants";

const Wall = ({ wall, numCol, brickSize, brickSpace }: WallProps) => {
  return (
    <div>
      {wall.map((y, iy) =>
        y.map((x, ix) =>
          x !== emptyWallBrick ? (
            <Brick
              key={iy * (numCol + 2) + ix + 1}
              brick={{ ...{ pX: ix, pY: iy } }}
              color={blocks[x].color}
              brickSize={brickSize}
              brickSpace={brickSpace}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default Wall;
