import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ChatListItem from "./ChatListItem";
import { Icon } from "@iconify/react";
import axios from "axios";
import AddNewGroupButton from "./AddNewGroupButton";
import NewPrivateChatButton from "./NewPrivateChatButton";
// axios.defaults.withCredentials = true;
const baseURL = "http://localhost:4000";

const PrivateChatList = () => {
  const [groups, setGroups] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      let token = localStorage.getItem("token");

      try {
        const res = await axios.get(baseURL + "/private/get", {
          headers: { Authorization: token },
        });
        setGroups(res.data.groups);
      } catch (error) {
        console.log(error);
      }
    }
    fetchGroups();
  }, []);
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="w-full lg:max-w-sm h-max flex flex-col lg:h-full  dark:border-white/10 border-y-1 lg:border-x-1 lg:border-y-0 gap-2  dark:bg-[#111111] p-2">
      <header className="w-full h-max flex lg:flex-col justify-between items-center lg:items-start gap-2">
        <h1 className=" min-w-fit h-max  text-3xl font-bold">V-Chat</h1>
        <div
          id="search-box"
          className="lg:w-full max-w-xl flex items-center gap-2 "
        >
          <Input
            size="sm"
            type="text"
            placeholder="Search Group or Chats"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <NewPrivateChatButton />
          {/* <Icon icon="bxs:message-square-add" width={50} height={50} /> */}
        </div>
      </header>

      <section className="w-full h-max  lg:h-full flex lg:flex-col overflow-y-auto ">
        <h1 className=" min-w-fit h-max mb-2 text-2xl font-semibold border-b-1 dark:border-white/20 hidden lg:block ">
          Private Chats
        </h1>
        {searchInput === ""
          ? groups.map((group, index) => (
              <NavLink key={group.id} to={group.id}>
                <ChatListItem imageURL={group.iconURL} itemName={group.name} />
              </NavLink>
            ))
          : filteredGroups.map((group, index) => (
              <NavLink key={group.id} to={group.id}>
                <ChatListItem imageURL={group.iconURL} itemName={group.name} />
              </NavLink>
            ))}
      </section>
    </div>
  );
};

export default PrivateChatList;
