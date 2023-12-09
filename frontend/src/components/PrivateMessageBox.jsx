import { Image, Textarea } from "@nextui-org/react";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import SenderChatBox from "./SenderChatBox";
import RecieverChatBox from "./RecieverChatBox";
import axios from "axios";
import { socket } from "../socket";
import useUserStore from "../store/userStore";
import UploadButton from "./UploadButton";
import useUploadMediaStore from "../store/uploadMediaStore";

const PrivateMessageBox = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const { chatID } = useParams();
  const listRef = useRef(null);
  const [inputField, setinputField] = useState("");
  const [chats, setChats] = useState([]);
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { selectedFile, selectedFileURL, setSelectedFile, setSelectedFileURL } =
    useUploadMediaStore((state) => ({
      selectedFile: state.selectedFile,
      selectedFileURL: state.selectedFileURL,
      setSelectedFile: state.setSelectedFile,
      setSelectedFileURL: state.setSelectedFileURL,
    }));
  socket.on("receive_message", (data) => {
    console.log("data", data);
    const chatOBJ = {
      date: data.date,
      message: data.message,
      name: data.name,
      roomId: data.room,
      type: data.type,
    };
    if (chatID == data.room) {
      setChats([...chats, chatOBJ]);
    }
  });
  function formatDate(date) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const meridiem = hours >= 12 ? "PM" : "AM";

    const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
      .toString()
      .padStart(2, "0");

    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${meridiem}`;
  }
  function sendMsgRealTime(chat, room) {
    socket.emit("send_message", { ...chat, room });
  }

  function handleRestInputs() {
    setinputField("");
    setSelectedFile(null);
    setSelectedFileURL(null);
  }

  async function handleSend() {
    const messageObj = {
      name: user.name,
      message: inputField,
      date: formatDate(new Date()),
      type: "text",
      roomID: chatID,
    };

    sendMsgRealTime(messageObj, chatID);

    handleRestInputs();
  }
  return (
    <section className="w-full h-screen flex flex-col overflow-hidden">
      <header className="w-full flex items-center justify-between h-16  dark:bg-[#111111] dark:border-white/10 p-2 border-b-1">
        <div className="w-full h-full flex justify-start items-center overflow-hidden gap-2">
          {/* <div id="ChatImage" className="w-15">
            <Image
              alt="NextUI hero Image"
              src={
                "https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              className="w-10 h-10 object-cover rounded-lg"
            />
          </div> */}
          <div id="ChatInfo" className="w-full overflow-clip">
            <h3 className=" lg:text-xl text-start font-semibold truncate ">
              {"**********"}
            </h3>
          </div>
        </div>
        <div className="w-max ">
          <Icon icon="pepicons-pop:dots-y" height={30} />
        </div>
      </header>
      <>
        <ul
          className="w-full h-full  overflow-y-auto flex flex-col gap-2  py-2 bg-[url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)] dark:bg-[url(assets/darkBackdrop.png)]  "
          ref={listRef}
        >
          {chats.map((chat, index) =>
            chat.name == user.name ? (
              chat.type == "text" ? (
                <li className="w-full h-max" key={index}>
                  <SenderChatBox
                    messageText={chat.message}
                    messageTime={chat.date}
                  />
                </li>
              ) : (
                <li className="w-full h-max" key={index}>
                  <SenderChatBox
                    mediaURL={chat.message}
                    messageTime={chat.date}
                  />
                </li>
              )
            ) : chat.type == "text" ? (
              <li className="w-full h-max" key={index}>
                <RecieverChatBox
                  senderName={chat.name}
                  messageText={chat.message}
                  messageTime={chat.date}
                />
              </li>
            ) : (
              <li className="w-full h-max" key={index}>
                <RecieverChatBox
                  senderName={chat.name}
                  mediaURL={chat.message}
                  messageTime={chat.date}
                />
              </li>
            )
          )}
        </ul>
        <div className="w-full flex items-end  h-max dark:border-white/10 p-2 border-t-1 gap-2 ">
          {/* <Icon
              icon="fluent:attach-20-regular"
              height={30}
              width={30}
              className="pb-2"
            /> */}
          {/* <UploadButton /> */}
          <div className="w-full flex flex-col gap-2">
            <p className="w-full text-sm font-bold text-center">Private Chat</p>

            <Textarea
              size="md"
              minRows={1}
              maxRows={6}
              value={inputField}
              placeholder="Enter your description"
              className="w-full h-full"
              onChange={(e) => {
                setinputField(e.target.value);
              }}
              on
            />
          </div>

          <Icon
            icon="ic:round-send"
            height={30}
            width={30}
            className="pb-2"
            onClick={handleSend}
          />
        </div>
      </>
    </section>
  );
};

export default PrivateMessageBox;
