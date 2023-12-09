import { Image, Textarea, Button } from "@nextui-org/react";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import SenderChatBox from "./SenderChatBox";
import RecieverChatBox from "./RecieverChatBox";
import axios from "axios";

import { toast } from "react-toastify";

import useUserStore from "../store/userStore";
import UploadButton from "./UploadButton";
import useUploadMediaStore from "../store/uploadMediaStore";
import CreateCallButton from "./CallFeatureComponents/CreateCallButton";
import { socket } from "../socket";

const GroupMessageBox = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const { chatID } = useParams();

  const listRef = useRef(null);
  const [inputField, setinputField] = useState("");
  const [chats, setChats] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
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
  socket.on("calling", (data) => {
    const notify = (id) => {
      toast(
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold w-full text-start">
            Incoming call....
          </p>
          <div className="w-full flex items-center gap-1 ">
            <div id="ChatImage" className="w-15 min-w-[2.5rem]">
              <Image
                alt="Caller Icon"
                src={data.iconURL}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div className="w-full flex items-center ">
              <p className="w-full max-w-lg text-lg font-bold capitalize truncate text-start">
                {data.name}
              </p>
              <div className="w-max flex items-center gap-2">
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  className=" rounded-full "
                >
                  <Icon icon="subway:call-3" width="20" height="20" />
                </Button>
                <NavLink to={`/chat/call/${data.meetingID}`}>
                  <Button
                    isIconOnly
                    color="success"
                    size="sm"
                    className=" rounded-full"
                  >
                    <Icon icon="subway:call" width="20" height="20" />
                  </Button>
                </NavLink>
              </div>
            </div>

            <div></div>
          </div>
        </div>,
        {
          toastId: id,
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    };
    notify(data.meetingID);
  });
  useEffect(() => {
    async function fetchChats() {
      let token = localStorage.getItem("token");

      try {
        const res = await axios.get(baseURL + "/chat/get/" + chatID, {
          headers: { Authorization: token },
        });
        socket.emit("join_room", chatID);
        setChats(res.data.chats);
        handleRestInputs();
      } catch (error) {
        console.log(error);
      }
    }

    fetchChats();
    async function fetchGroupDetails() {
      let token = localStorage.getItem("token");

      try {
        const res = await axios.get(baseURL + "/group/" + chatID + "/details", {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setGroupDetails(res.data.group);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchGroupDetails();
  }, [chatID]);
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chats]);
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

  async function handleSendMessageWithMedia() {
    if (selectedFile) {
      // const fileType = selectedFile.type;
      // const fileFormData = new FormData();

      // fileFormData.append("name", selectedFile.name);

      // if (fileType.startsWith("image/")) {
      //   fileFormData.append("type", "Image");
      //   0;
      // } else if (fileType.startsWith("video/")) {
      //   fileFormData.append("type", "Video");
      // } else if (fileType.startsWith("audio/")) {
      //   fileFormData.append("type", "Audio");
      // } else if (fileType === "application/pdf") {
      //   fileFormData.append("type", "PDF");
      // } else {
      //   fileFormData.append("type", "Unknown");
      // }
      // // fileFormData.append("size", formatFileSize(selectedFile.size));
      // fileFormData.append("caption", inputField);

      // fileFormData.append("date", formatDate(new Date()));

      // fileFormData.append("file", selectedFile);

      // console.log(fileFormData);
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("message", selectedFile);
      formData.append("roomID", chatID);
      formData.append("date", formatDate(new Date()));
      formData.append("type", "image");
      console.log("Called sendFile FormData", formData);
      try {
        let token = localStorage.getItem("token");

        const res = await axios.post(
          baseURL + "/chat/upload",

          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );

        console.log(res.data);
        if (res.data.succes) {
          const imageObj = {
            name: res.data.chat.name,
            message: res.data.chat.message,
            date: res.data.chat.date,
            type: res.data.chat.type,
            roomID: chatID,
          };
          console.log(imageObj);
          setChats([...chats, imageObj]);
          sendMsgRealTime(imageObj, chatID);
        }
      } catch (err) {
        console.log(err);
        window.alert("Database Error");
      }
      handleRestInputs();
    }
  }

  async function handleSend() {
    if (selectedFile === null) {
      const messageObj = {
        name: user.name,
        message: inputField,
        date: formatDate(new Date()),
        type: "text",
        roomID: chatID,
      };
      try {
        let token = localStorage.getItem("token");
        const res = await axios.post(
          baseURL + "/chat/add",

          messageObj,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data.succes) {
          setChats([...chats, res.data.chat]);
          sendMsgRealTime(res.data.chat, chatID);
        }
      } catch (error) {
        console.log(error);
      }

      handleRestInputs();
    } else {
      handleSendMessageWithMedia();
    }
  }
  return (
    <section className="w-full h-screen flex flex-col overflow-hidden">
      {groupDetails && (
        <header className="w-full flex items-center justify-between h-16  dark:bg-[#111111] dark:border-white/10 p-2 border-b-1">
          <div className="w-full  h-full flex justify-start items-center overflow-hidden gap-2 ">
            <div id="ChatImage" className="w-15 min-w-[2.5rem]">
              <Image
                alt="NextUI hero Image"
                src={groupDetails.iconURL}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div id="ChatInfo" className="w-full overflow-clip">
              <h3 className=" lg:text-xl text-start font-semibold truncate ">
                {groupDetails.name}
              </h3>
            </div>
          </div>
          <div className="w-max flex items-center ">
            <CreateCallButton
              groupID={chatID}
              groupDetails={groupDetails}
              insideContent={
                <Icon icon="fluent:call-add-24-filled" width="20" height="20" />
              }
            />

            <Icon icon="pepicons-pop:dots-y" height={30} />
          </div>
        </header>
      )}
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
          <UploadButton />
          <div className="w-full flex flex-col gap-2">
            {selectedFileURL && (
              <Image
                alt="NextUI hero Image"
                src={selectedFileURL}
                className=" max-h-40 w-full object-cover rounded-lg"
              />
            )}

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

export default GroupMessageBox;
