import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Avatar,
  Input,
  Chip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import useUserStore from "../store/userStore";
import axios from "axios";

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "S. Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    name: "Brian Kim",
    role: "P. Manager",
    team: "Management",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
    email: "brian.kim@example.com",
    status: "Active",
  },
  {
    id: 7,
    name: "Michael Hunt",
    role: "Designer",
    team: "Design",
    status: "paused",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
    email: "michael.hunt@example.com",
  },
  {
    id: 8,
    name: "Samantha Brooks",
    role: "HR Manager",
    team: "HR",
    status: "active",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
    email: "samantha.brooks@example.com",
  },
  {
    id: 9,
    name: "Frank Harrison",
    role: "F. Manager",
    team: "Finance",
    status: "vacation",
    age: "33",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
    email: "frank.harrison@example.com",
  },
  {
    id: 10,
    name: "Emma Adams",
    role: "Ops Manager",
    team: "Operations",
    status: "active",
    age: "35",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
    email: "emma.adams@example.com",
  },
  {
    id: 11,
    name: "Brandon Stevens",
    role: "Jr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
    email: "brandon.stevens@example.com",
  },
  {
    id: 12,
    name: "Megan Richards",
    role: "P. Manager",
    team: "Product",
    status: "paused",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
    email: "megan.richards@example.com",
  },
  {
    id: 13,
    name: "Oliver Scott",
    role: "S. Manager",
    team: "Security",
    status: "active",
    age: "37",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
    email: "oliver.scott@example.com",
  },
  {
    id: 14,
    name: "Grace Allen",
    role: "M. Specialist",
    team: "Marketing",
    status: "active",
    age: "30",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
    email: "grace.allen@example.com",
  },
  {
    id: 15,
    name: "Noah Carter",
    role: "IT Specialist",
    team: "I. Technology",
    status: "paused",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
    email: "noah.carter@example.com",
  },
  {
    id: 16,
    name: "Ava Perez",
    role: "Manager",
    team: "Sales",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
    email: "ava.perez@example.com",
  },
  {
    id: 17,
    name: "Liam Johnson",
    role: "Data Analyst",
    team: "Analysis",
    status: "active",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
    email: "liam.johnson@example.com",
  },
  {
    id: 18,
    name: "Sophia Taylor",
    role: "QA Analyst",
    team: "Testing",
    status: "active",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
    email: "sophia.taylor@example.com",
  },
  {
    id: 19,
    name: "Lucas Harris",
    role: "Administrator",
    team: "Information Technology",
    status: "paused",
    age: "32",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
    email: "lucas.harris@example.com",
  },
  {
    id: 20,
    name: "Mia Robinson",
    role: "Coordinator",
    team: "Operations",
    status: "active",
    age: "26",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
    email: "mia.robinson@example.com",
  },
];
const AddNewGroupButton = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const { setUser, allUserList } = useUserStore((state) => ({
    setUser: state.setUser,
    allUserList: state.allUserList,
  }));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(new Set([]));
  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState("");

  function resetInputField() {
    setSelectedUser([]);
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

  async function handleCreateGroup() {
    const token = localStorage.getItem("token");
    const groupOBJ = {
      groupName: groupName,
      imageURL: groupIcon,
      users: Array.from(selectedUser),
    };
    console.log(groupOBJ);
    try {
      const res = await axios.post(baseURL + "/group/add", groupOBJ, {
        headers: { Authorization: token },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    handleOpen();
  }
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
                Create Group
              </ModalHeader>
              <ModalBody>
                <Input
                  size="sm"
                  isRequired
                  type="text"
                  label="Group Name"
                  placeholder="Enter Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Input
                  size="sm"
                  type="text"
                  label="Group Icon"
                  placeholder="Enter Icon URL"
                  onChange={(e) => setGroupIcon(e.target.value)}
                />
                <Select
                  size="sm"
                  items={allUserList}
                  label="Add users"
                  placeholder="Select users"
                  selectedKeys={selectedUser}
                  selectionMode="multiple"
                  onSelectionChange={setSelectedUser}
                  isMultiline={true}
                  classNames={{
                    // base: "max-w-xs",
                    trigger: "min-h-unit-12 py-2",
                  }}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        {items.map((item) => (
                          <Chip className="bg-green-500 " key={item.key}>
                            {item.data.name}
                          </Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {(user) => (
                    <SelectItem key={user.email} textValue={user.name}>
                      <div className="flex gap-2 items-center">
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
                    </SelectItem>
                  )}
                </Select>
                {/* <p className="text-small text-default-500">
                  Selected: {Array.from(value).join(", ")}
                </p> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={handleOpen}>
                  Cancel
                </Button>
                <Button color="primary" onClick={handleCreateGroup}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNewGroupButton;
