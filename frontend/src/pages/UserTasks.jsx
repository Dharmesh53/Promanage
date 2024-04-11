import Board from "@/components/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import BurnBarrel from "@/components/ui/burnBarrel";
import { useToast } from "@/components/ui/use-toast";

const UserTasks = () => {
  const { toast } = useToast();
  const [userCards, setUserCards] = useState();
  const [hasChecked, sethasChecked] = useState(false);

  const fetcher = async () => {
    const res = await axios.get(`http://localhost:5000/api/task/`);
    setUserCards(res.data.tasks);
  };

  const handleSave = async () => {
    const res = await axios.put(
      `http://localhost:5000/api/user/updateTask`,
      userCards
    );
    if (res.status === 200) {
      toast({
        title: "Successfully updated",
        description: "Your board is Saved",
      });
    }
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
    <div className="h-full relative bg-white p-4">
      {userCards && (
        <>
          <Board cards={userCards} setCards={setUserCards} />
          <BurnBarrel setCards={setUserCards} />
        </>
      )}
    </div>
  );
};

export default UserTasks;
