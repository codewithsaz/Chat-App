import { Image, Textarea } from "@nextui-org/react";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import SenderChatBox from "./SenderChatBox";
import RecieverChatBox from "./RecieverChatBox";
import axios from "axios";
import darkBackdrop from "../assets/darkBackdrop.png";

const baseURL = "http://localhost:4000";

const PersonalMessageBox = () => {
  const { chatID } = useParams();
  const listRef = useRef(null);
  const [inputField, setinputField] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    console.log("called useEffect");
    console.log(token);
    async function fetchGroups() {
      try {
        const res = await axios.get(baseURL + "/chat/get/" + chatID, {
          headers: { Authorization: token },
        });
        console.log(res.data.chats);
        setChats(res.data.chats);
      } catch (error) {
        console.log(error);
      }
    }

    fetchGroups();
    // return () => {
    //   ;
    // };
  }, [chatID]);
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chats]);

  function handleSend() {
    // console.log([
    //   ...chats,
    //   {
    //     createdAt: "2023-11-15T16:41:04.000Z",
    //     date: "10:11 PM",
    //     id: 60,
    //     message: inputField,
    //     name: "demo",
    //     roomId: "41d2c626-1266-4021-8e2f-38a0de59e28a",
    //     type: "text",
    //     updatedAt: "2023-11-15T16:41:04.000Z",
    //     userId: 1,
    //   },
    // ]);
    setChats([
      ...chats,
      {
        createdAt: "2023-11-15T16:41:04.000Z",
        date: "10:11 PM",
        id: 60,
        message: inputField,
        name: "demo",
        roomId: "41d2c626-1266-4021-8e2f-38a0de59e28a",
        type: "text",
        updatedAt: "2023-11-15T16:41:04.000Z",
        userId: 1,
      },
    ]);
    setinputField("");
  }
  return (
    <section className="w-full h-screen flex flex-col overflow-hidden">
      <header className="w-full flex items-center justify-between h-16  dark:bg-[#111111] dark:border-white/10 p-2 border-b-1">
        <div className="w-full h-full flex justify-start items-center overflow-hidden gap-2">
          <div id="ChatImage" className="w-15">
            <Image
              alt="NextUI hero Image"
              src={
                "https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              className="w-10 h-10 object-cover rounded-lg"
            />
          </div>
          <div id="ChatInfo" className="w-full overflow-clip">
            <h3 className=" lg:text-xl text-start font-semibold truncate ">
              {chatID}
            </h3>
          </div>
        </div>
        <div className="w-max ">
          <Icon icon="pepicons-pop:dots-y" height={30} />
        </div>
      </header>
      <>
        {/* <div className="w-full h-full   "> */}
        <ul
          className="w-full h-full  overflow-y-auto flex flex-col gap-2  py-2 bg-[url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)] dark:bg-[url(assets/darkBackdrop.png)]  "
          ref={listRef}
        >
          {chats.map((chat, index) =>
            chat.type == "text" ? (
              <li className="w-full h-max">
                <RecieverChatBox
                  senderName={chat.name}
                  key={index}
                  messageText={chat.message}
                  messageTime={chat.date}
                />
              </li>
            ) : (
              <li className="w-full h-max">
                <RecieverChatBox
                  senderName={chat.name}
                  key={index}
                  mediaURL={chat.message}
                  messageTime={chat.date}
                />
              </li>
            )
          )}
          {/* <SenderChatBox messageText="Hey" messageTime="10:25 PM" /> */}
          {/* <SenderChatBox
                messageText="I took this image"
                messageTime="10:25 pm"
                mediaURL="https://images.pexels.com/photos/18305445/pexels-photo-18305445/free-photo-of-himalayan-child.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />

              <RecieverChatBox
                senderName="David"
                messageText="Wow it looks good"
                messageTime="10:25 PM"
                mediaURL="https://images.pexels.com/photos/18305445/pexels-photo-18305445/free-photo-of-himalayan-child.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />

              <RecieverChatBox
                senderName="David"
                messageText="What camera do u use"
                messageTime="10:25 PM"
              /> */}
        </ul>
        <div className="w-full flex items-end  h-max dark:border-white/10 p-2 border-t-1 gap-2 ">
          <Icon
            icon="fluent:attach-20-regular"
            height={30}
            width={30}
            className="pb-2"
          />
          <Textarea
            size="md"
            minRows={1}
            value={inputField}
            placeholder="Enter your description"
            className="w-full h-full"
            onChange={(e) => {
              setinputField(e.target.value);
            }}
            on
          />
          <Icon
            icon="ic:round-send"
            height={30}
            width={30}
            className="pb-2"
            onClick={handleSend}
            onkey
          />
        </div>
      </>
    </section>
  );
};

export default PersonalMessageBox;
