import Board from "@/components/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import BurnBarrel from "@/components/ui/burnBarrel";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TbRefresh } from "react-icons/tb";

const UserTasks = () => {
  const { toast } = useToast();
  const [userCards, setUserCards] = useState();
  const [hasChecked, sethasChecked] = useState(false);
  const [clicked, setClicked] = useState();

  const fetcher = async () => {
    setClicked((prev) => !prev);
    const res = await axios.get(`http://localhost:5000/api/task/`);
    setUserCards(res.data.tasks);
    setClicked((prev) => !prev);
  };

  const handleSave = async () => {
    setClicked((prev) => !prev);
    await axios
      .put(`http://localhost:5000/api/user/updateTask`, userCards)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Successfully updated",
            description: "Your board is saved",
          });
        }
      });
    setClicked((prev) => !prev);
  };

  useEffect(() => {
    hasChecked && localStorage.setItem("userCards", JSON.stringify(userCards));
    if (hasChecked) {
      const intervalId = setTimeout(() => handleSave(), 10000);
      return () => clearTimeout(intervalId);
    }
  }, [hasChecked, userCards]);

  useEffect(() => {
    const cardData = localStorage.getItem("userCards");
    setUserCards(cardData ? JSON.parse(cardData) : []);
    sethasChecked(true);
    fetcher();
  }, []);

  return (
    <div className="h-full relative bg-white p-4 pt-0">
      <div className="my-4 font-medium text-xl">Your Tasks</div>
      {userCards && (
        <>
          <Board cards={userCards} setCards={setUserCards} userBoard={true} />
          <BurnBarrel setCards={setUserCards} />
        </>
      )}
      <Button
        className={`absolute top-0 right-4`}
        variant="ghost"
        onClick={fetcher}
      >
        <TbRefresh
          size={25}
          className={`${clicked && "animate-spin-reverse"}`}
        />
      </Button>
    </div>
  );
};

export default UserTasks;
