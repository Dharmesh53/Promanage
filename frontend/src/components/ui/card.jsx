import { motion } from "framer-motion";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CardUpdate from "./cardUpdate";

const Card = (props) => {
  const {
    _id,
    title,
    assignee,
    due,
    priority,
    status,
    column,
    handleDragStart,
  } = props;
  return (
    <>
      <Sheet>
        <DropIndicator beforeId={_id} column={column} />
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              layout
              layoutId={_id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, { title, _id, column })}
              className="cursor-grab text-sm rounded border border-neutral-200 bg-white p-2 active:cursor-grabbing"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {title[0].toUpperCase() + title.slice(1)}
                </span>
                <span className="mr-1">
                  <span
                    className={` rounded-full text-xs  px-2  border ${
                      priority === "High"
                        ? "bg-orange-200 border-orange-600"
                        : priority === "Medium"
                        ? "bg-yellow-200 border-yellow-600"
                        : "bg-teal-200 border-teal-600"
                    } `}
                  >
                    {priority}
                  </span>
                </span>
              </div>
              <div className="font-xs flex justify-between items-center mt-2 text-neutral-500">
                <span>{format(due, "PPP")}</span>
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="rounded-full bg-slate-200 border-1 size-6 flex items-center justify-center font-medium mr-2 cursor-default">
                      {assignee?.email[0].toUpperCase()}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-1">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-sm block font-semibold">
                          {assignee?.name}
                        </span>
                        <span className="text-sm">{assignee?.email}</span>
                      </div>
                      <div>
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.pdng" />
                          <AvatarFallback className="bg-red-100 cursor-default">
                            {assignee?.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </motion.div>
          </ContextMenuTrigger>
          <SheetTrigger>
            <ContextMenuContent>
              <ContextMenuItem className="font-pops">Edit</ContextMenuItem>
            </ContextMenuContent>
          </SheetTrigger>
        </ContextMenu>
        <CardUpdate {...props} />
      </Sheet>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-amber-400 opacity-0"
    />
  );
};

export { DropIndicator };
export default Card;
