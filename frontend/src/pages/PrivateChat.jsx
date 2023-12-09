import React from "react";
import { Outlet } from "react-router-dom";
import PrivateChatList from "../components/PrivateChatList";
const PrivateChat = () => {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row ">
      <PrivateChatList />

      <Outlet />
    </div>
  );
};

export default PrivateChat;
