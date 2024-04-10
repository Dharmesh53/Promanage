import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Input } from "./input";
import { Label } from "./label";
import { format } from "date-fns";
import { SlCalender } from "react-icons/sl";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Textarea } from "./textarea";
import { useSelector } from "react-redux";
import { Button } from "./button";

const cardUpdate = (props) => {
  const { _id, title, assignee, due, priority } = props;
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState("d");
  const [newAssignee, setNewAssignee] = useState(assignee.email);
  const [newPriority, setNewPriority] = useState(priority);
  const [date, setDate] = useState(due);
  const [progess, setProgess] = useState("");
  const [clicked, setClicked] = useState(false);

  const assigneList = useSelector(
    (state) => state.project?.project?.project?.teams[0]?.users
  );

  return (
    <SheetContent className=" font-pops">
      <SheetHeader>
        <SheetTitle>Edit Task</SheetTitle>
        <SheetDescription className="flex flex-col gap-2 text-black">
          <Label>Title</Label>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Label>Description</Label>
          <Textarea
            placeholder="Describe task"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
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
          <Label htmlFor="newAssignee">Change Assignee</Label>
          <Select
            name="newAssignee"
            value={newAssignee}
            onValueChange={setNewAssignee}
          >
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
          <Label htmlFor="progess">Progress</Label>
          <Select value={progess} onValueChange={setProgess}>
            <SelectTrigger>
              <SelectValue placeholder="Progress of task" />
            </SelectTrigger>
            <SelectContent className="font-pops">
              <SelectItem value="Off track">Off Track</SelectItem>
              <SelectItem value="On track">On Track</SelectItem>
              <SelectItem value="At risk">At risk</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="newPriority">Priority</Label>
          <Select value={newPriority} onValueChange={setNewPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className="font-pops">
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setClicked((prev) => !prev)}
            className={`${clicked && "bg-gray-400  cursor-progress"}`}
          >
            Update Task
          </Button>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default cardUpdate;
