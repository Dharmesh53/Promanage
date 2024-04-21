import React from "react";
import { NodeResizer } from "reactflow";

const ShapeNode = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        color="#d6921e"
        minWidth={10}
        minHeight={10}
      />
      <div
        className={`bg-neutral-100 shape ${
          data.shape === "square" ? "rounded-lg" : "rounded-full"
        }  w-full h-full min-h-10 min-w-10`}
      ></div>
    </>
  );
};

export default ShapeNode;
