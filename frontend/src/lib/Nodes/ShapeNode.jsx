import React, { useRef, useState } from "react";
import { NodeResizer } from "reactflow";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import { TwitterPicker } from "react-color";

const ShapeNode = (props) => {
  const shapeRef = useRef(null);
  const [popover, setPopover] = useState(false);
  const [bgColor, setBgColor] = useState("#ccc");

  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ background: "#8c8b85" }}
      />
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
        isVisible={props.selected}
        color="#d6921e"
        minWidth={10}
        minHeight={10}
      />
      <div
        ref={shapeRef}
        onContextMenu={(e) => {
          e.preventDefault();
          setPopover((prev) => !prev);
        }}
        className={`bg-[#22194d] shape ${
          props.data.shape === "square" ? "rounded-lg" : "rounded-full"
        }  w-full h-full min-h-10 min-w-10`}
        style={{
          backgroundColor: bgColor,
        }}
      >
        <AnimatePresence>
          {popover && (
            <motion.div
              className="absolute bottom-[-35%] right-[-7%] flex rounded scale-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <TwitterPicker
                triangle="hide"
                onChange={(color) => {
                  setBgColor(color.hex);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ShapeNode;
