import React from "react";
import { NavLink } from "react-router-dom";
import vChatIntro from "../assets/vChatIntro.jpg";
import VChatlogo from "../assets/VChatlogo.png";

const Home = () => {
  return (
    <div className="w-full h-screen">
      <div className="h-full w-full flex flex-col items-center lg:item justify-center p-4 lg:flex-row ">
        <div className=" flex flex-col md:max-w-2xl lg:max-w-2xl justify-center items-center text-center gap-2 lg:text-left lg:items-start ">
          <h1 className=" text-5xl lg:text-6xl font-semibold ">
            Let's Connect
          </h1>
          <h1 className=" text-5xl lg:text-6xl font-semibold ">
            with Your Firends
          </h1>
          <h1 className=" text-5xl lg:text-6xl font-semibold ">in Real Time</h1>
          <h1 className=" text-lg lg:text-xl  ">
            Experience the power of seamless communication with a dynamic app
            that goes beyond words, building meaningful conversations. Stay
            connected, express yourself, and let your conversations resonate
            with clarity and authenticity with support for realtime voice and
            video calls.
          </h1>
          <h1 className=" text-xl lg:text-2xl font-semibold ">
            {" "}
            V Chat, where every voice matters.
          </h1>
          <div className="w-full justify-center lg:justify-start flex gap-2">
            <NavLink to="/register">
              <button className=" bg-black text-white rounded-lg  w-40 p-2 mt-2 ">
                Start Chatting
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className=" bg-black text-white rounded-lg w-40 p-2 mt-2 ">
                Login
              </button>
            </NavLink>
          </div>
        </div>
        <div className="h-96 lg:h-auto  m-4 ">
          <img
            className="w-full max-w-2xl h-full object-fill rounded-xl"
            src={vChatIntro}
            alt=""
          />
        </div>
      </div>

      {/* <NavLink to="/login">
        <p className="w-20 px-4 py-2">Login</p>
      </NavLink>

      <NavLink to="/chat">
        <p className="w-20 px-4 py-2">Chats</p>
      </NavLink> */}
    </div>
  );
};

export default Home;
