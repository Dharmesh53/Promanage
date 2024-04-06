import React, { useState } from "react";
import Column from "./ui/column";
import BurnBarrel from "./ui/burnBarrel";

const Board = ({ cards, setCards }) => {
  return (
    <div className="h-full">
      <div className="flex gap-2 board  overflow-scroll">
        <Column
          title="To Do"
          column="todo"
          Color="amber"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          Color="cyan"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Review"
          column="review"
          Color="rose"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="complete"
          Color="lime"
          cards={cards}
          setCards={setCards}
        />
      </div>
    </div>
  );
};

export default Board;
