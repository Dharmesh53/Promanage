import Board from "@/components/Board";
import { TbRefresh } from "react-icons/tb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setProject } from "../store/projectSlice";
import { useToast } from "@/components/ui/use-toast";
import BurnBarrel from "@/components/ui/burnBarrel";
import ProjectDetails from "@/components/ProjectDetails";
import DrawBoard from "@/components/DrawBoard";

const projectOfId = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [cards, setCards] = useState();

  const [hasChecked, sethasChecked] = useState(false);
  const [clicked, setClicked] = useState(false);

  const fetcher = async () => {
    setClicked((prev) => !prev);
    const res = await axios.get(`http://localhost:5000/api/project/${id}`);
    const result = res.data;
    setCards(result.project.tasks);
    dispatch(setProject(result));
    setClicked((prev) => !prev);
  };

  const handleSave = async () => {
    await axios
      .put(`http://localhost:5000/api/project/updateTask/${id}`, cards)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Successfully updated",
            description: "Your board is saved",
          });
        }
      });
  };

  useEffect(() => {
    hasChecked && localStorage.setItem(`${id}`, JSON.stringify(cards));
    if (hasChecked) {
      const intervalId = setTimeout(() => handleSave(), 10000);
      return () => clearTimeout(intervalId);
    }
  }, [hasChecked, cards]);

  useEffect(() => {
    const cardData = localStorage.getItem(`${id}`);
    setCards(cardData ? JSON.parse(cardData) : []);
    sethasChecked(true);
    fetcher();
  }, [id]);

  return (
    <div className="h-full relative bg-white p-4">
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="draw">Draw</TabsTrigger>
        </TabsList>
        <TabsContent value="board">
          {cards && (
            <>
              <Board cards={cards} setCards={setCards} userBoard={false} />
              <BurnBarrel setCards={setCards} />
              <Button
                className={`absolute top-4 right-4`}
                variant="ghost"
                onClick={fetcher}
              >
                <TbRefresh
                  size={25}
                  className={` ${clicked && "animate-spin"}`}
                />
              </Button>
            </>
          )}
        </TabsContent>
        <TabsContent value="overview">
          <ProjectDetails />
        </TabsContent>
        <TabsContent value="files">your files</TabsContent>
        <TabsContent value="draw">
          <DrawBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default projectOfId;
