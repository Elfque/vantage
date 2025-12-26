import { IconType } from "react-icons";
import { FaHome } from "react-icons/fa";
import { TiDocument } from "react-icons/ti";
import { RiProfileLine } from "react-icons/ri";

type sidebarItemType = {
  label: string;
  href: string;
  Icon: IconType;
};

export const sidebarItems: sidebarItemType[] = [
  { label: "Dashboard", href: "/", Icon: FaHome },
  { label: "Create Resume", href: "/resume/new", Icon: TiDocument },
  { label: "Create Portfolio", href: "/portfolio/new", Icon: RiProfileLine },
];
