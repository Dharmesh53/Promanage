// import React, { useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
import { NodeResizer } from "reactflow";
import { Handle, Position } from "reactflow";

const ShapeNode = ({ data, selected }) => {
  // const drawBoard = useSelector((state) => state?.drawboard);
  // const canvasRef = useRef(null);
  // const ctx = canvasRef?.current?.getContext("2d");

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     canvas.width = canvas.offsetWidth;
  //     canvas.height = canvas.offsetHeight;
  //   }
  // }, []);

  // const drawing = (e) => {
  //   if (!drawBoard?.isDrawing || !ctx) return;
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
  //   ctx.lineWidth = 2;
  //   ctx.lineTo(x, y);
  //   ctx.stroke();
  // };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        style={{ background: "#8c8b85" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="c"
        style={{ background: "#8c8b85" }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="d"
        style={{ background: "#8c8b85" }}
      />
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
      >
        {/* <canvas ref={canvasRef} onMouseMove={drawing}></canvas> */}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ background: "#8c8b85" }}
      />
    </>
  );
};

//Drawing for future

export default ShapeNode;
