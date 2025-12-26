import Sidebar from "./Sidebar";
import { ReactNode } from "react";

type appType = {
  children: ReactNode;
};

const AppLayout = ({ children }: appType) => {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-dvh">
      <Sidebar />
      <div className="h-dvh overflow-y-auto">{children}</div>
    </div>
  );
};

export default AppLayout;
