import React, { useRef, useState } from "react";
import { NodeResizer } from "reactflow";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import { TwitterPicker } from "react-color";
import { MdDeleteOutline } from "react-icons/md";
import { CgColorBucket } from "react-icons/cg";
import { useSelector } from "react-redux";
import socket from "@/lib/socket";

const ShapeNode = (props) => {
  const shapeRef = useRef(null);
  const [popover, setPopover] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [bgColor, setBgColor] = useState("#ccc");
  const projectId = useSelector((state) => state.project?.project?.project._id);

  const handleColorChange = (color) => {
    setBgColor(color.hex);
    setColorPickerVisible(false);
  };

  const handleDelete = () => {
    socket.emit("deleteNode", props.id, projectId, (response) => {
      console.log(response);
    });
    props.setNodes((nodes) => nodes.filter(node => node.id !== props.id));
  };

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
        } w-full h-full min-h-10 min-w-10`}
        style={{
          backgroundColor: bgColor,
        }}
      >
        <AnimatePresence>
          {popover && (
            <motion.div
              className="absolute right-[90%] gap-1 bg-white border flex rounded scale-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <button
                onClick={() => setColorPickerVisible((prev) => !prev)}
                className="hover:bg-slate-200 gap-2 p-1"
              >
                <CgColorBucket size={16} />
              </button>
              <button
                className="hover:bg-slate-200 gap-2 p-1"
                 onClick={handleDelete}
              >
                <MdDeleteOutline size={16} />
              </button>
              {colorPickerVisible && (
                <div className="absolute z-10">
                  <TwitterPicker
                    color={bgColor}
                    triangle="hide"
                    onChangeComplete={handleColorChange}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ShapeNode;
