import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { NodeResizer } from "reactflow";
import { MdTextIncrease } from "react-icons/md";
import { TbCopy } from "react-icons/tb";
import { MdTextDecrease } from "react-icons/md";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import socket from "@/lib/socket";

export default function TextBoxNode(props) {
  const Fonts = [
    "text-xs",
    "text-sm",
    "text-md",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
  ];
  const textareaRef = useRef(null);
  const [popover, setPopover] = useState(false);
  const [fontSize, setFontSize] = useState(0);
  const [width, setWidth] = useState(145);
  const [height, setHeight] = useState(43);
  const [text, setText] = useState(props.data.value);
  const projectId = useSelector((state) => state.project?.project?.project._id);

  const onChange = useCallback((e) => {
    props.data.value = e.target.value;
    setText(e.target.value);
  }, []);

  // function adjustHeight() {
  //   let element = textareaRef.current;
  //   if (element.scrollHeight < 80 * 16 && element.scrollHeight > height) {
  //     element.style.height = "1px";
  //     element.style.height = 5 + element.scrollHeight + "px";
  //   } else {
  //     element.style.height = "100px";
  //   }
  // }

  const handleContextMenu = (event) => {
    event.preventDefault();
    setPopover((prev) => !prev);
  };

  const handleDelete = () => {
    socket.emit("deleteNode", props.id, projectId, (response) => {
      console.log(response);
    });
    props.setNodes((nodes) => nodes.filter(node => node.id !== props.id));
  };
  return (
    <>
      <Handle type="target" position={Position.Top} id="b" />
      <Label htmlFor="text">
        <NodeResizer
          isVisible={props.selected}
          color="#d6921e"
          minWidth={145}
          minHeight={42}
          onResize={(event, dimensions) => {
            setWidth(dimensions.width);
            setHeight(dimensions.height);
          }}
        />
        <textarea
          ref={textareaRef}
          id="text"
          name="text"
          placeholder="Enter text"
          value={text}
          onContextMenu={handleContextMenu}
          // onInput={adjustHeight}
          onChange={onChange}
          spellCheck="false"
          className={`outline-none resize-none min-h-10 border rounded-lg relative border-black max-h-[80rem] font-chilanka w-36 focus-visible:ring-0 p-1 font-normal overflow-auto  text-center ${Fonts[fontSize]} `}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      </Label>
      <AnimatePresence>
        {popover && (
          <motion.div
            className="absolute top-[-33%] right-0 flex bg-white border rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <button
              className="hover:bg-slate-200 gap-2 p-1"
              onClick={() => {
                setFontSize((prev) => Math.min(prev + 1, 6));
              }}
            >
              <MdTextIncrease size={16} />
            </button>
            <button
              className="hover:bg-slate-200 gap-2 p-1"
              onClick={() => setFontSize((prev) => Math.max(prev - 1, 0))}
            >
              <MdTextDecrease size={16} />
            </button>
            <button
              className=" gap-2 p-1 hover:bg-slate-200"
              onClick={() =>
                navigator.clipboard.writeText(textareaRef.current.value)
              }
            >
              <TbCopy size={14} />
            </button>
              <button
                className="hover:bg-slate-200 gap-2 p-1"
                onClick={handleDelete} 
              >
                <MdDeleteOutline size={16}/>
              </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
