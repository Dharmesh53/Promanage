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
import { useState } from "react";

const Projectform = () => {
  const [title, setTitle] = useState(null);
  const [value, setValue] = useState(null);

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/project/create", {
      title,
      value,
    });
    console.log(value, title);
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
                <SelectValue placeholder="Select team for project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Button type="submit" onClick={handleSubmit} className="mt-3">
            Submit
          </Button>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default Projectform;
