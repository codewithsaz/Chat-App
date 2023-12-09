import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PersonalChat from "../pages/PersonalChat";
import GroupChat from "../pages/GroupChat";
import PrivateChat from "../pages/PrivateChat";
import VoiceCall from "../pages/VoiceCall";
import VideoCall from "../pages/VideoCall";
import Profile from "../pages/Profile";
import Error_404 from "../pages/Error_404";
import ChatLayout from "./ChatLayout";
import Home from "../pages/Home";
import GroupMessageBox from "../components/GroupMessageBox";
import PrivateMessageBox from "../components/PrivateMessageBox";
import Call from "../pages/Call";
import JoinScreen from "../components/CallFeatureComponents/JoinScreen";
import PersonalMessageBox from "../components/PersonalMessageBox";

const MainLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<ChatLayout />}>
        <Route path="" element={<PersonalChat />} />
        <Route path="personal" element={<PersonalChat />}>
          <Route path=":chatID" element={<PersonalMessageBox />} />
        </Route>
        <Route path="group" element={<GroupChat />}>
          <Route path=":chatID" element={<GroupMessageBox />} />
        </Route>
        <Route path="private" element={<PrivateChat />}>
          <Route path=":chatID" element={<PrivateMessageBox />} />
        </Route>
        <Route path="call">
          <Route path="" element={<JoinScreen />} />
          <Route path=":roomID" element={<Call />} />
        </Route>
      </Route>
      <Route path="/profile" element={<Profile />} />

      {/* <Route path="/*" element={<Error_404 />} /> */}
    </Routes>
  );
};

export default MainLayout;
