import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Projectform = ({ teams }) => {
  const { toast } = useToast();
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState("");
  const [filteredTeam, setFilteredTeam] = useState();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    setFilteredTeam(
      teams?.names?.filter((team) => team.createdBy === user.email)
    );
  }, []);

  const handleSubmit = async () => {
    try {
      const selectedTeam = teams?.names?.find((team) => team.title === value);
      if (!selectedTeam) {
        console.log("Selected team not found");
        return;
      }
      const { id: teamId } = selectedTeam;
      const result = await axios.post(
        "http://localhost:5000/api/project/create",
        {
          title,
          teamId,
          createdBy: user.email,
        }
      );
      if (result.status == 200) {
        toast({
          title: "Done !!",
          description: "Successfully created project",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="font-pops">
        <DialogTitle className="mb-3">Create new Project</DialogTitle>
        <DialogDescription className="text-black flex flex-col gap-4">
          <Label>
            Title
            <Input
              className="mt-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Label>
          <Label>
            Team
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="mt-3">
                <SelectValue>{value || "Select team for project"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredTeam?.map((item, i) => (
                  <SelectItem value={item.title} className="font-pops" key={i}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
        </DialogDescription>
      </DialogHeader>
      <Button onClick={handleSubmit} className="mt-3">
        Submit
      </Button>
    </DialogContent>
  );
};

export default Projectform;
