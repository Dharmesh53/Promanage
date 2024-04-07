import React from "react";
import { motion } from "framer-motion";

const Card = ({
  _id,
  title,
  assignee,
  due,
  priority,
  status,
  column,
  handleDragStart,
}) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={column} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, _id, column })}
        className="cursor-grab rounded border border-neutral-200 bg-neutral-100 p-3 active:cursor-grabbing"
      >
        <p className="text-sm">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-amber-400 opacity-0"
    />
  );
};

export { DropIndicator };
export default Card;
