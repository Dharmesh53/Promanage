import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen font-pops bg-white">
      <div className="flex justify-center border-b text-lg">ProManage</div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
