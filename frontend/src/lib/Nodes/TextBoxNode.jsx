import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRef } from "react";
import { HiOutlineArrowDownOnSquareStack } from "react-icons/hi2";
import { HiOutlineArrowUpOnSquareStack } from "react-icons/hi2";
import { useCallback } from "react";
import { MdTextIncrease } from "react-icons/md";
import { MdTextDecrease } from "react-icons/md";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export default function TextBoxNode({ data }) {
  const textareaRef = useRef(null);
  const [popover, setPopover] = useState(false);
  const [fontSize, setFontSize] = useState("text-xs");
  const [text, setText] = useState(data.value);

  const onChange = useCallback((e) => {
    data.value = e.target.value;
    setText(e.target.value);
  }, []);

  function adjustHeight() {
    let element = textareaRef.current;
    if (element && element.scrollHeight < 80 * 16) {
      element.style.height = "1px";
      element.style.height = 5 + element.scrollHeight + "px";
    }
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
    setPopover((prev) => !prev);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} id="b" />
      <div
        className={`bg-white border rounded-lg relative border-black max-h-[80rem] p-1`}
      >
        <Label htmlFor="text">
          <Textarea
            ref={textareaRef}
            id="text"
            name="text"
            placeholder="Enter text"
            value={text}
            onContextMenu={handleContextMenu}
            onInput={adjustHeight}
            onChange={onChange}
            className={`border-none outline-none w-36 focus-visible:ring-0 p-2 font-normal overflow-auto text-center ${fontSize} resize-none`}
          />
        </Label>
        <AnimatePresence>
          {popover && (
            <motion.div
              className="absolute top-[-33%] right-0 flex gap-2 p-1 px-1 bg-white border rounded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <MdTextIncrease size={16} onClick={() => setFontSize()} />
              <MdTextDecrease size={16} onClick={() => setFontSize()} />
              <HiOutlineArrowDownOnSquareStack
                onClick={() => (data.zIndex -= 500)}
              />
              <HiOutlineArrowUpOnSquareStack
                onClick={() => (data.zIndex -= 500)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
