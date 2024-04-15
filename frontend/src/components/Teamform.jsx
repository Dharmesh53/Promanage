import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Teamform = ({ user }) => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (user && !members.length) {
      setMembers((prev) => [...prev, user?.email]);
    }
  }, [user]);

  const addMember = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMembers((prev) => [...prev, input]);
      setInput("");
    }
  };

  const removeMember = (idx) => {
    setMembers((prev) => prev.filter((_, i) => idx != i));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/team/create", {
        title: title,
        members,
        createdBy: user.email,
      });
      toast({
        title: "Done !!",
        description: "Successfully created a new team",
      });
    } catch (error) {
      toast({
        title: "Error ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <DialogHeader className="font-pops ">
          <DialogTitle className="my-3">Create new Team</DialogTitle>
          <DialogDescription className="text-black">
            <Input
              placeholder="Enter Your Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-3"
            />
            <Input
              placeholder="Add new emails and press enter"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mb-3"
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  addMember(e);
                }
              }}
            />
            <div className="flex flex-wrap gap-3">
              {members?.map((member, i) => (
                <DropdownMenu key={i}>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarFallback>
                        {member?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-pops">
                    <DropdownMenuLabel>{member}</DropdownMenuLabel>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem onClick={() => removeMember(i)}>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
            <Button className="my-3" onClick={handleSubmit}>
              Make Team
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </form>
  );
};

export default Teamform;
