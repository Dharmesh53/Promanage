import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { logout } from "../store/authSlice";
import Navbar from "@/components/Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";

const Layout = () => {
  const [toggle, setToggle] = useState(true);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendReq = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", null, {
      withCredentials: true,
    });
    if (res.status == 200) {
      return res;
    }
    throw new Error("Unable to Logout");
  };
  const handleLogout = () => {
    sendReq().then(() => dispatch(logout()));
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });
      const data = await res.data;
      return data;
    };
    fetcher().then((res) => setUser(res));
  }, []);
  return (
    <div className="flex flex-col h-screen font-pops ">
      <div className="flex justify-between border-b bg-white">
        <Button
          variant="ghost"
          onClick={() => {
            setToggle((prev) => !prev);
          }}
          className=" m-0"
        >
          <RxHamburgerMenu size={18} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center ">
              <Avatar className="scale-75 ">
                {user?.image && <AvatarImage src={user.image} />}
                <AvatarFallback>
                  {user
                    ? user?.name[0].toUpperCase() + user?.name[1].toUpperCase()
                    : "CN"}
                </AvatarFallback>
              </Avatar>
              <IoIosArrowDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-pops">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex overflow-auto">
        <div
          className={`transition-all ${
            toggle
              ? "w-[12%] opacity-100 translate-x-0 "
              : "w-0 opacity-0 -translate-x-full "
          }`}
        >
          <Navbar />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
