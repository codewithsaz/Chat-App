import React from "react";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import ToogleThemeButton from "./ToogleThemeButton";
import VChatlogo from "../assets/VChatlogo.png";
import useUserStore from "../store/userStore";

const SideBar = () => {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  return (
    <div className=" dark:border-white/10 border-t-1 lg:border-0 w-full lg:w-20 flex lg:flex-col justify-evenly lg:justify-between items-center gap-2 py-2   px-4 dark:bg-[#111111]">
      <div
        id="navigation-elements"
        className="w-full flex lg:flex-col justify-evenly items-center lg:gap-10"
      >
        <img src={VChatlogo} alt="" className="h-14 w-14 hidden lg:block" />

        <NavLink to="personal">
          <Icon
            icon="material-symbols:person"
            width={30}
            height={30}
            className="text-inherit"
          />
        </NavLink>
        <NavLink to="group">
          <Icon
            icon="el:group"
            width={30}
            height={30}
            className="text-inherit"
          />
        </NavLink>
        <NavLink to="private">
          <Icon
            icon="akar-icons:eye-slashed"
            width={30}
            height={30}
            className="text-inherit"
          />
        </NavLink>
        <NavLink to="call">
          <Icon
            icon="carbon:phone-voice-filled"
            width={30}
            height={30}
            className="text-inherit"
          />
        </NavLink>
        <ToogleThemeButton />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="success"
              name={user.name}
              size="sm"
              src={user.profileIconURL}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold capitalize">{user.name}</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">Profile</DropdownItem>
            {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SideBar;
