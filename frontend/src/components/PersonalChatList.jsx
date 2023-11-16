import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/react";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import ChatListItem from "./ChatListItem";
import { Icon } from "@iconify/react";

const animals = [
  {
    label: "Cat",
    value: "cat",
    description: "The second most popular pet in the world",
  },
  {
    label: "Dog",
    value: "dog",
    description: "The most popular pet in the world",
  },
  {
    label: "Elephant",
    value: "elephant",
    description: "The largest land animal",
  },
  { label: "Lion", value: "lion", description: "The king of the jungle" },
  { label: "Tiger", value: "tiger", description: "The largest cat species" },
  {
    label: "Giraffe",
    value: "giraffe",
    description: "The tallest land animal",
  },
  {
    label: "Dolphin",
    value: "dolphin",
    description: "A widely distributed and diverse group of aquatic mammals",
  },
  {
    label: "Penguin",
    value: "penguin",
    description: "A group of aquatic flightless birds",
  },
  {
    label: "Zebra",
    value: "zebra",
    description: "A several species of African equids",
  },
  {
    label: "Shark",
    value: "shark",
    description:
      "A group of elasmobranch fish characterized by a cartilaginous skeleton",
  },
  {
    label: "Whale",
    value: "whale",
    description: "Diverse group of fully aquatic placental marine mammals",
  },
  {
    label: "Otter",
    value: "otter",
    description: "A carnivorous mammal in the subfamily Lutrinae",
  },
  {
    label: "Crocodile",
    value: "crocodile",
    description: "A large semiaquatic reptile",
  },
];

const PersonalChatList = () => {
  return (
    <div className="w-full lg:max-w-sm h-max flex flex-col lg:h-full  dark:border-white/10 border-y-1 lg:border-x-1 lg:border-y-0 gap-2  dark:bg-[#111111] p-2">
      <header className="w-full h-max flex lg:flex-col justify-between items-center lg:items-start gap-2">
        <h1 className=" min-w-fit h-max  text-3xl font-bold">V-Chat</h1>
        <div
          id="search-box"
          className="lg:w-full max-w-xl flex items-center gap-2 "
        >
          <Autocomplete size="sm" label="Search User or Chat">
            {animals.map((animal) => (
              <AutocompleteItem key={animal.value} value={animal.value}>
                {animal.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Icon icon="bxs:message-square-add" width={50} height={50} />
        </div>
      </header>

      <section className="w-full h-max  lg:h-full flex lg:flex-col overflow-y-auto ">
        <h1 className=" min-w-fit h-max mb-2 text-2xl font-semibold border-b-1 dark:border-white/20 hidden lg:block ">
          Personal Chats
        </h1>
        <NavLink to="asdfd-asdasd-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David asdasd as sadasdas"
          />
        </NavLink>
        <NavLink to="asdfd-ghchfg-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="Kevin"
          />
        </NavLink>
        <NavLink to="asdfd-asdasd-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David"
          />
        </NavLink>
        <NavLink to="asdfd-cvb453-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="Kevin"
          />
        </NavLink>
        <NavLink to="asdfd-sdfg34ts-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David"
          />
        </NavLink>
        <NavLink to="asdfd-21431241-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="Kevin"
          />
        </NavLink>
        <NavLink to="asdfd-asdasd-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David"
          />
        </NavLink>
        <NavLink to="asdfd-ghchfg-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="Kevin"
          />
        </NavLink>
        <NavLink to="asdfd-asdasd-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David"
          />
        </NavLink>
        <NavLink to="asdfd-cvb453-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="Kevin"
          />
        </NavLink>
        <NavLink to="asdfd-sdfg34ts-asdas">
          <ChatListItem
            imageURL="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            itemName="David"
          />
        </NavLink>
      </section>
    </div>
  );
};

export default PersonalChatList;
