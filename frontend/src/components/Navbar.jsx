import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GrTask } from "react-icons/gr";
import { HiOutlineInbox } from "react-icons/hi2";
import { GrProjects } from "react-icons/gr";
import { RiTeamLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { Button } from "./ui/button";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <aside className="h-[95.7vh] w-full bg-white">
      <nav className="h-full border-r">
        <div className="flex flex-col gap-2">
          <Link
            to="/tasks"
            className="flex items-center gap-2 p-2 m-1 rounded-lg hover:bg-amber-200 duration-300 transition-colors"
          >
            <GrTask size={18} />
            My Tasks
          </Link>
          <Link
            to="/inbox"
            className="flex items-center gap-2 p-2 m-1 rounded-lg hover:bg-amber-200 duration-300 transition-colors"
          >
            <HiOutlineInbox size={18} />
            Inbox
          </Link>
          <Link
            to="/projects"
            className="flex items-center justify-between  p-2 m-1 rounded-lg hover:bg-amber-200 duration-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <GrProjects size={18} />
              Projects
            </span>
            <span>
              <FaPlus size={12} />
            </span>
          </Link>
          <Link
            to="/teams"
            className="flex items-center justify-between  p-2 m-1 rounded-lg hover:bg-amber-200 duration-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RiTeamLine size={18} />
              Teams
            </span>
            <span>
              <FaPlus size={12} />
            </span>
          </Link>
          <Button
            variant="link"
            className="text-lg font-medium text-amber-500 border-t  absolute bottom-0 w-full"
          >
            <Link to="/" className="tracking-[0.1em]">
              ProManage
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;
