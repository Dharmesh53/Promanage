import { useState } from "react";
import { FaFire } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c._id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-2 grid p-4 shrink-0 place-content-center cursor-pointer rounded border text-3xl ${
        active
          ? "border-red-500/40 bg-red-800/20 text-red-500"
          : "border-neutral-300 bg-neutral-300/20 text-neutral-400/80"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <IoTrashBinOutline />}
    </div>
  );
};
export default BurnBarrel;
