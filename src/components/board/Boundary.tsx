// Draws the shadow from a panel with offset
import { BoundaryProps } from "../../model/componentProps";

const Boundary = ({ xoffset, height }: BoundaryProps) => {
  return (
    <>
      {/* Grey frame around the playground */}
      <div
        style={{
          width: xoffset + 10,
          height: height + 10,
          background: "grey",
          position: "absolute",
          left: -5,
          top: -5,
          borderRadius: 16,
        }}
      ></div>
      {/* Panel */}
      <div
        className="playground-background"
        style={{
          width: xoffset,
          height: height,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      ></div>
    </>
  );
};

export default Boundary;
