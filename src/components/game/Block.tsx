import Brick from "./Brick";
import { BlockProps } from "../../model/componentProps";

const Block = ({
  bricks,
  color,
  brickSize,
  brickSpace,
  numCol,
}: BlockProps) => {
  return (
    <div>
      {bricks.map((brick: { pX: number; pY: number }) => (
        <Brick
          key={brick.pY * (numCol + 2) + brick.pX + 1}
          brick={brick}
          color={color}
          brickSize={brickSize}
          brickSpace={brickSpace}
        />
      ))}
    </div>
  );
};

export default Block;
