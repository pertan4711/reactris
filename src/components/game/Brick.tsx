import { BrickProps } from "../../model/types";

const Brick = ({ brick, color, brickSize, brickSpace }: BrickProps) => {
  let myColor = color;
  if (color === undefined) myColor = "white";
  return (
    <div
      style={{
        width: brickSize,
        height: brickSize,
        background: myColor,
        position: "absolute",
        left: brick.pX * brickSpace,
        top: brick.pY * brickSpace,
      }}
    ></div>
  );
};

export default Brick;
