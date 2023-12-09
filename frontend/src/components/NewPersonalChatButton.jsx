import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ScrollShadow,
  Avatar,
  Input,
  user,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import useUserStore from "../store/userStore";
import axios from "axios";

const NewPersonalChatButton = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { setUser, allUserList } = useUserStore((state) => ({
    setUser: state.setUser,
    allUserList: state.allUserList,
  }));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchInput, setSearchInput] = useState("");

  const [value, setValue] = useState("");
  const [selectedUser, setSelectedUser] = useState({});

  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState("");

  function resetInputField() {
    setSelectedUser({});
    setValue("");
    setGroupName("");
    setGroupIcon("");
  }
  function handleOpen() {
    resetInputField();
    onOpenChange();
  }
  function handleSelect() {
    onOpenChange();
  }

  async function handleCreateChat() {
    const token = localStorage.getItem("token");
    const groupOBJ = {
      user: value,
    };
    console.log(groupOBJ);
    try {
      const res = await axios.post(baseURL + "/personal/add", groupOBJ, {
        headers: { Authorization: token },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    handleOpen();
  }
  const filteredUsers = allUserList.filter((user) =>
    user.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <>
      <button onClick={onOpen} className="">
        <Icon icon="bxs:message-square-add" width={50} height={50} />
        {/* <Icon
            icon="fluent:attach-20-regular"
            height={30}
            width={30}
            className="pb-2 hover:text-green-500"
          /> */}
      </button>
      <Modal isOpen={isOpen} onOpenChange={handleOpen}>
        <ModalContent>
          {(handleOpen) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Chat
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-full">
                  <Input
                    size="sm"
                    type="text"
                    className="rounded-lg"
                    placeholder="Search User"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <ScrollShadow hideScrollBar className="px-1 py-2 max-h-56">
                    {searchInput === ""
                      ? allUserList.map((user, index) => (
                          <div
                            className="flex gap-2 items-center p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded-lg"
                            key={index}
                            onClick={(e) => {
                              setValue(user.email);
                              setSelectedUser(user);
                            }}
                          >
                            <Avatar
                              alt={user.name}
                              className="flex-shrink-0"
                              size="sm"
                              src={user.profileIconURL}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{user.name}</span>
                              <span className="text-tiny text-default-400">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        ))
                      : filteredUsers.map((user, index) => (
                          <div
                            className="flex gap-2 items-center p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                            key={index}
                            onClick={(e) => {
                              setValue(user.email);
                              setSelectedUser(user);
                            }}
                          >
                            <Avatar
                              alt={user.name}
                              className="flex-shrink-0"
                              size="sm"
                              src={user.profileIconURL}
                            />
                            <div className="flex flex-col" key={index}>
                              <span className="text-small">{user.name}</span>
                              <span className="text-tiny text-default-400">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        ))}
                  </ScrollShadow>
                </div>
              </ModalBody>
              <ModalFooter className="flex items-center">
                {value.length > 0 && (
                  <div className="flex gap-2 items-center w-full font-semibold text-sm dark:bg-zinc-800 p-2 rounded-lg">
                    <Avatar
                      alt={selectedUser.name}
                      className="flex-shrink-0"
                      size="sm"
                      src={selectedUser.profileIconURL}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{selectedUser.name}</span>
                      <span className="text-tiny text-default-400">
                        {selectedUser.email}
                      </span>
                    </div>
                  </div>
                )}

                <Button color="danger" variant="light" onClick={handleOpen}>
                  Cancel
                </Button>
                <Button color="primary" onClick={handleCreateChat}>
                  Chat
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewPersonalChatButton;
