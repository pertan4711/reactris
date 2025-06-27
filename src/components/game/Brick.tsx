import { BrickProps } from "../../model/componentProps";

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
        borderRadius: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // Add a subtle shadow for depth
      }}
    ></div>
  );
};

export default Brick;
