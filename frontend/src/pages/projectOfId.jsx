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

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios.get(`http://localhost:5000/api/project/${id}`);
      const result = res.data;
      result.tasks = [...DEFAULT_CARDS];
      setCards(result.tasks);
      dispatch(setProject(result));
    };
    fetcher();
  }, []);

  return (
    <div className="h-full bg-white p-4">
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

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "review" },
  { title: "SOX compliance checklist", id: "2", column: "review" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "review" },
  { title: "Document Notifications service", id: "4", column: "review" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "complete",
  },
];

export default projectOfId;
