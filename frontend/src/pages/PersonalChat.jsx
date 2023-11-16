import React from "react";
import { Outlet } from "react-router-dom";
import PersonalChatList from "../components/PersonalChatList";

const PersonalChat = () => {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row ">
      <PersonalChatList />
      <Outlet />
    </div>
  );
};

export default PersonalChat;
