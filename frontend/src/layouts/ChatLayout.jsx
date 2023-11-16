import React from "react";
import SideBar from "../components/SideBar";
import PersonalChat from "../pages/PersonalChat";
import { Outlet, Route, Routes } from "react-router-dom";
import GroupChat from "../pages/GroupChat";
import PrivateChat from "../pages/PrivateChat";
import VoiceCall from "../pages/VoiceCall";
import VideoCall from "../pages/VideoCall";

const ChatLayout = () => {
  return (
    <div className="w-full h-full flex flex-col-reverse lg:flex-row overflow-auto">
      <SideBar />
      <Outlet />
    </div>
  );
};

export default ChatLayout;
