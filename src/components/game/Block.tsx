import Brick from "./Brick";
import { BlockProps } from "../../model/componentProps";

const Block = ({
  bricks,
  color,
  brickSize,
  brickSpace,
  numCol,
}: BlockProps) => {
  // Create a radial gradient using the block color
  const gradient = `radial-gradient(circle at 50% 50%, ${color} 60%, #222 100%)`;

  return (
    <div>
      {bricks.map((brick: { pX: number; pY: number }) => (
        <Brick
          key={brick.pY * (numCol + 2) + brick.pX + 1}
          brick={brick}
          color={color}
          brickSize={brickSize}
          brickSpace={brickSpace}
          style={{
            background: gradient,
          }}
        />
      ))}
    </div>
  );
};

export default Block;
