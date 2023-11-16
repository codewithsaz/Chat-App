import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ChatListItem from "./ChatListItem";
import { Icon } from "@iconify/react";
import axios from "axios";
// axios.defaults.withCredentials = true;
const baseURL = "http://localhost:4000";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5hbWUiOiJkZW1vIiwiaWF0IjoxNzAwMDY4ODMwfQ.M0eXPTP0MWDi2RTZgMroH4cghtzw7An6latFM7M5WIk";
const GroupChatList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    console.log("called useEffect");
    console.log(token);
    async function fetchGroups() {
      try {
        const res = await axios.get(baseURL + "/group/get", {
          headers: { Authorization: token },
        });
        console.log(res.data.groups);
        setGroups(res.data.groups);
      } catch (error) {
        console.log(error);
      }
    }
    fetchGroups();

    // return () => {
    //   ;
    // };
  }, []);

  return (
    <div className="w-full lg:max-w-sm h-max flex flex-col lg:h-full  dark:border-white/10 border-y-1 lg:border-x-1 lg:border-y-0 gap-2  dark:bg-[#111111] p-2">
      <header className="w-full h-max flex lg:flex-col justify-between items-center lg:items-start gap-2">
        <h1 className=" min-w-fit h-max  text-3xl font-bold">V-Chat</h1>
        <div
          id="search-box"
          className="lg:w-full max-w-xl flex items-center gap-2 "
        >
          <Input size="sm" type="text" placeholder="Search Group or Chats" />

          <Icon icon="bxs:message-square-add" width={50} height={50} />
        </div>
      </header>

      <section className="w-full h-max  lg:h-full flex lg:flex-col overflow-y-auto ">
        <h1 className=" min-w-fit h-max mb-2 text-2xl font-semibold border-b-1 dark:border-white/20 hidden lg:block ">
          Group Chats
        </h1>
        {groups.map((group, index) => (
          <NavLink key={group.id} to={group.id}>
            <ChatListItem imageURL={group.iconURL} itemName={group.name} />
          </NavLink>
        ))}
      </section>
    </div>
  );
};

export default GroupChatList;
