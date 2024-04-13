import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";

const ProjectDetails = () => {
  const project = useSelector((state) => state.project?.project?.project);
  const [title, setTitle] = useState(project?.title);
  const [description, setDescription] = useState(project?.description);
  const [progess, setprogess] = useState(project?.progess);
  const [totalMembers, setTotalMembers] = useState(0);

  const colors = ["#d3869b", "#8ec07c", "#83a595", "#fabd2f", "#b8bb26"];

  useEffect(() => {
    let membersCount = 0;
    project?.teams.forEach((team) => {
      membersCount += team.users.length;
    });
    setTitle(project?.title);
    setDescription(project?.description);
    setprogess(project?.progess);
    setTotalMembers(membersCount);
  }, [project]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(title, description, progess);
    await axios.put(
      `http://localhost:5000/api/project/updateProject/${project._id}`,
      {
        title,
        description,
        progess,
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <span className="font-semibold text-2xl">{project?.title}</span>
          <span
            className={`text-sm ml-2  border rounded-full px-2 ${
              progess === "At risk"
                ? "bg-orange-200 border-orange-600"
                : progess === "Off track"
                ? "bg-yellow-200 border-yellow-600"
                : "bg-teal-200 border-teal-600"
            } `}
          >
            {project?.progess}
          </span>
          <p className="text-sm"> {project?.tasks.length} Tasks</p>
        </div>
        <div className="flex">
          {project?.teams.map((team) =>
            team.users.slice(0, 4).map((user, i) => {
              const randomColor =
                colors[Math.floor(Math.random() * colors.length)];
              return (
                <Avatar
                  className={`border-4 border-white z-[50] -ml-3 `}
                  key={i}
                >
                  <AvatarImage src="\" />
                  <AvatarFallback style={{ backgroundColor: randomColor }}>
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
            })
          )}
          {totalMembers - 4 > 0 && (
            <Avatar className="border border-black z-0 -ml-3 ">
              <AvatarImage src="\" />
              <AvatarFallback
                style={{
                  backgroundColor:
                    colors[Math.floor(Math.random() * colors.length)],
                }}
              >
                +{totalMembers - 4}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border grid rounded-lg border-neutral-400 border-dashed p-4">
          <div className="flex w-full gap-4">
            <div className="w-1/2">
              <Label htmlFor="title" className="text-md ">
                Title
              </Label>
              <Input
                name="title"
                className="mb-2 "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="status" className="text-md ">
                Progress
              </Label>
              <Select value={progess} onValueChange={setprogess}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Off track">Off track</SelectItem>
                  <SelectItem value="On track">On track</SelectItem>
                  <SelectItem value="At risk">At risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Label htmlFor="description" className="text-md">
            Description
          </Label>
          <Textarea
            name="description"
            className="h-[30rem]"
            value={description}
            placeholder="Describe your project"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button className="w-1/4 mx-auto my-4" onClick={handleUpdate}>
            Update
          </Button>
        </div>
        <div className="border rounded-lg border-neutral-400 border-dashed p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Teams</span>
            <Button variant="secondary">Add Teams</Button>
          </div>
          {project?.teams.map((team, idx) => (
            <Collapsible key={idx}>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <span className="text-xl">{team.title}</span>
                <span>
                  <IoIosArrowDown />
                </span>
              </CollapsibleTrigger>
              <Separator />
              <CollapsibleContent>
                <AnimatePresence>
                  {team?.users.map((user, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.15 }}
                      className="p-2 bg-gray-100/70 my-1 rounded"
                    >
                      <span className="p-1 border border-black mr-3 text-sm rounded-full bg-gray-200">
                        {user.email.slice(0, 2).toUpperCase()}
                      </span>
                      {user.email}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
