import { CgRemoveR } from "react-icons/cg";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FaCheck } from "react-icons/fa6";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";

const ProjectDetails = () => {
  const { toast } = useToast();

  const project = useSelector((state) => state.project?.project?.project);
  const teams = useSelector((state) => state.auth?.user?.teams);
  const user = useSelector((state) => state.auth?.user);
  const [title, setTitle] = useState(project?.title);
  const [description, setDescription] = useState(project?.description);
  const [progess, setprogess] = useState(project?.progess);
  const [newTeam, setNewTeam] = useState("Select new team");
  const [totalMembers, setTotalMembers] = useState(0);

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
    await axios.put(
      `http://localhost:5000/api/project/updateProject/${project._id}`,
      {
        title,
        description,
        progess,
      }
    );
  };

  const handleAddTeam = async () => {
    if (newTeam === "Select new team") {
      toast({
        variant: "destructive",
        className: "bg-red-400 p-2",
        title: "Please select a team",
      });
      return;
    }
    let teamId = null;
    teams.forEach((team) => {
      if (team.title === newTeam) {
        teamId = team._id;
      }
    });
    try {
      await axios.post(
        `http://localhost:5000/api/project/addTeam/${project._id}`,
        { teamId }
      );
    } catch (error) {
      toast({
        variant: "destructive",
        className: "bg-red-400 p-2",
        title: error.response.data.msg,
      });
    }
  };

  const handleRemoveTeam = async (teamId, code) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/project/removeTeam/${project._id}/${teamId}?code=${code}`
      );
    } catch (error) {
      toast({
        variant: "destructive",
        className: "bg-red-400 p-2",
        title: error.response.data.msg || "error",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <span className="font-semibold text-2xl">{project?.title}</span>
          {progess?.progess != undefined && (
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
          )}
          <p className="text-sm"> {project?.tasks.length} Tasks</p>
        </div>
        <div className="flex">
          {project?.teams.map((team) =>
            team.users.slice(0, 4).map((user, i) => {
              return (
                <Avatar
                  className={`border-4 border-white z-[50] -ml-3 `}
                  key={i}
                >
                  <AvatarImage src="\" />
                  <AvatarFallback className="bg-[#94dbba]">
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
            })
          )}
          {totalMembers - 4 > 0 && (
            <Avatar className="border-4 border-white z-0 -ml-3 ">
              <AvatarImage src="\" />
              <AvatarFallback className="bg-[#94dbba]">
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
                disabled={user?.email !== project?.createdBy}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="status" className="text-md ">
                Progress
              </Label>
              <Select
                value={progess}
                onValueChange={setprogess}
                disabled={user?.email !== project.createdBy}
              >
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
            className="h-[30rem] "
            value={description}
            disabled={user?.email !== project.createdBy}
            placeholder="Describe your project"
            onChange={(e) => setDescription(e.target.value)}
          />
          {user?.email === project.createdBy && (
            <Button className="w-1/4 mx-auto my-4" onClick={handleUpdate}>
              Update
            </Button>
          )}
        </div>
        <div className="border rounded-lg border-neutral-400 border-dashed p-4">
          {user?.email === project.createdBy ? (
            <>
              <span className="font-medium">Add new teams</span>
              <div className="flex gap-3 mb-4">
                <Select value={newTeam} onValueChange={setNewTeam}>
                  <SelectTrigger>
                    <SelectValue>{newTeam}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="font-pops">
                    {teams?.map((team, i) => (
                      <SelectItem value={team.title} key={i}>
                        {team.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="p-2" onClick={handleAddTeam}>
                  <FaCheck size={17} />
                </Button>
              </div>
            </>
          ) : (
            <span className="font-medium">Teams</span>
          )}
          {project?.teams.map((team, idx) => (
            <Collapsible key={idx}>
              <CollapsibleTrigger className="flex items-center justify-between w-full my-1">
                <span className="text-lg">{team.title}</span>
                {user?.email === project.createdBy && (
                  <span>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button className="text-red-400" variant="link">
                          <CgRemoveR />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="flex w-full flex-col gap-3">
                            <Button
                              onClick={() => handleRemoveTeam(team._id, 1)}
                            >
                              Delete Team and delete task assigned to team
                              members
                            </Button>
                            <Button
                              onClick={() => handleRemoveTeam(team._id, 2)}
                            >
                              Delete Team and remove the assignee's of those
                              task
                            </Button>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </span>
                )}
              </CollapsibleTrigger>
              <Separator />
              <CollapsibleContent>
                <AnimatePresence>
                  {team?.users.map((user, i) => (
                    <motion.div
                      key={i}
                      layout
                      layoutId={i}
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
