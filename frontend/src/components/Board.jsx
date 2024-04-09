import Column from "./ui/column";
import { FiPlusCircle } from "react-icons/fi";

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
          column="inprogess"
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
        <button className="h-[80vh] flex w-full justify-center items-center cursor-pointer rounded border border-neutral-200 bg-neutral-50">
          <FiPlusCircle size={30} className="text-neutral-400" />
        </button>
      </div>
    </div>
  );
};

export default Board;
