import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import PersonalChat from "../pages/PersonalChat";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../store/userStore";
const ChatLayout = () => {
  const { setUser, setAllUserList } = useUserStore((state) => ({
    setUser: state.setUser,
    setAllUserList: state.setAllUserList,
  }));
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(baseURL + "/user/details", {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        navigate("/login", { replace: true });
      }
    }
    fetchUserDetails();
    async function fetchAllUserDetails() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(baseURL + "/user/all", {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setAllUserList(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllUserDetails();
  }, []);

  return (
    <div className="w-full h-full flex flex-col-reverse lg:flex-row overflow-auto">
      <SideBar />
      <Outlet />
    </div>
  );
};

export default ChatLayout;
