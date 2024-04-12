import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "./button";
import { format } from "date-fns";
import { SlCalender } from "react-icons/sl";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { Input } from "./input";
import { Label } from "./label";
import { useSelector } from "react-redux";
import { useToast } from "./use-toast";

const AddCard = ({ column, setCards, userBoard }) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [clicked, setClicked] = useState(false);
  const { toast } = useToast();

  const assigneList = useSelector(
    (state) => state.project?.project?.project?.teams[0]?.users
  );
  const user = useSelector((state) => state.auth.user);

  const id = useSelector((state) => state.project?.project?.project?._id);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setClicked((prev) => !prev);

      if (!text.trim().length) return;
      let assigneeObject = { name: user.name, email: user.email };
      if (!userBoard) {
        for (let i = 0; i < assigneList.length; i++) {
          if (assigneList[i].email == assignee) {
            assigneeObject = {
              name: assigneList[i].name,
              email: assigneList[i].email,
            };
            break;
          }
        }
      }
      const newCard = {
        status: column,
        title: text.trim(),
        assigneeObject,
        priority,
        due: date,
        project: userBoard ? id : "",
        createdBy: user.email,
      };
      const res = await axios.post(
        `http://localhost:5000/api/project/createTask/${id}`,
        newCard
      );
      if (res.status == 200) {
        toast({
          title: "Done!!",
          description: "Succesfully created task",
        });
        setCards((pv) => [...pv, res.data.task]);
        setClicked((prev) => !prev);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <motion.button
          layout
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-500"
        >
          <span>Add task</span>
          <FiPlus />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="font-pops">
        <DialogHeader>
          <DialogTitle className="mb-4">Create Task</DialogTitle>
          <DialogDescription className="text-black flex flex-col gap-3">
            <Label htmlFor="title" className="font-md">
              Title
            </Label>
            <Input
              name="title"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {!userBoard && (
              <>
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee for task" />
                  </SelectTrigger>
                  <SelectContent className="font-pops">
                    {assigneList?.map((al, i) => (
                      <SelectItem key={i} value={al.email}>
                        {al.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <Label htmlFor="calender">Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`
                    "justify-start text-left font-normal",
                    ${!date && "text-muted-foreground"}`}
                >
                  <SlCalender className="mr-2 size-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="font-pops">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              disabled={clicked}
              className={`${clicked && "bg-gray-400 cursor-progress"}`}
            >
              Create Task
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCard;
