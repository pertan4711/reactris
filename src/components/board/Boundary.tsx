// Draws the shadow from a panel with offset
import { BoundaryProps } from "../../model/componentProps";

const Boundary = ({ xoffset, height }: BoundaryProps) => {
  const xpos: string = xoffset.toString() + "px";
  const bheight: string = height.toString() + "px";
  return (
    <>
      {/* Panel */}
      <div
        className="playground-background"
        style={{
          width: xpos,
          height: bheight,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      ></div>
    </>
  );
};

export default Boundary;
