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

const Card = ({
  _id,
  title,
  assignee,
  due,
  priority,
  status,
  column,
  handleDragStart,
}) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={column} />
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            layout
            layoutId={_id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, { title, _id, column })}
            className="cursor-grab text-sm rounded border border-neutral-200 bg-neutral-50 p-2 active:cursor-grabbing"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {title[0].toUpperCase() + title.slice(1)}
              </span>
              <span className="mr-1">{priority}</span>
            </div>
            <div className="font-xs flex justify-between items-center mt-2">
              <span>{format(due, "PPP")}</span>
              <HoverCard>
                <HoverCardTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.pdng" />
                    <AvatarFallback className="bg-violet-100 cursor-default">
                      {assignee.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="p-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm block font-semibold">
                        {assignee.name}
                      </span>
                      <span className="text-sm">{assignee.email}</span>
                    </div>
                    <div>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.pdng" />
                        <AvatarFallback className="bg-red-100 cursor-default">
                          {assignee.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="font-pops">Edit</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
