import Column from "./ui/column";
import { FiPlusCircle } from "react-icons/fi";

const Board = ({ cards, setCards }) => {
  return (
    <div className="h-full">
      <div className="flex gap-2 board  overflow-scroll">
        {DEFAULT_COLUMNS.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            column={column.id}
            bgColor={column.bgColor}
            txtColor={column.txtColor}
            cards={cards}
            setCards={setCards}
          />
        ))}
        {/* <button className="h-[80vh] flex w-full justify-center items-center cursor-pointer rounded border border-neutral-200 bg-neutral-50">
          <FiPlusCircle size={30} className="text-neutral-400" />
        </button> */}
      </div>
    </div>
  );
};

const DEFAULT_COLUMNS = [
  {
    title: "To Do",
    id: "todo",
    bgColor: "bg-amber-100",
    txtColor: "text-amber-700",
  },
  {
    title: "In progress",
    id: "inprogess",
    bgColor: "bg-cyan-100",
    txtColor: "text-cyan-700",
  },
  {
    title: "Review",
    id: "review",
    bgColor: "bg-rose-100",
    txtColor: "text-rose-700",
  },
  {
    title: "Complete",
    id: "complete",
    bgColor: "bg-lime-100",
    txtColor: "text-lime-700",
  },
];

export default Board;
