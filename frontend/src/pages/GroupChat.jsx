import React from "react";
import GroupChatList from "../components/GroupChatList";
import { Outlet } from "react-router-dom";
const GroupChat = () => {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row ">
      <GroupChatList />
      <Outlet />
    </div>
  );
};

export default GroupChat;
