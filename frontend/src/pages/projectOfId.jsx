import Board from "@/components/Board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProject } from "../store/projectSlice";
import BurnBarrel from "@/components/ui/burnBarrel";

const projectOfId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [cards, setCards] = useState();
  const [hasChecked, sethasChecked] = useState(false);

  const fetcher = async () => {
    const res = await axios.get(`http://localhost:5000/api/project/${id}`);
    const result = res.data;
    setCards(result.project.tasks);
    dispatch(setProject(result));
  };

  const handleSave = async () => {
    await axios.put(
      `http://localhost:5000/api/project/updateTask/${id}`,
      cards
    );
  };

  useEffect(() => {
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
    if (hasChecked) {
      const intervalId = setTimeout(() => handleSave(), 10000);
      return () => clearTimeout(intervalId);
    }
  }, [hasChecked, cards]);

  useEffect(() => {
    const cardData = localStorage.getItem("cards");
    setCards(cardData ? JSON.parse(cardData) : []);
    sethasChecked(true);
    fetcher();
  }, []);

  return (
    <div className="h-full relative bg-white p-4">
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="board">
          {cards && (
            <>
              <Board cards={cards} setCards={setCards} />
              <BurnBarrel setCards={setCards} />
            </>
          )}
        </TabsContent>
        <TabsContent value="overview">description and team</TabsContent>
        <TabsContent value="files">your files</TabsContent>
      </Tabs>
    </div>
  );
};

export default projectOfId;
