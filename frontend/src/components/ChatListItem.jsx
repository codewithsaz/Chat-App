import React from "react";
import { Image } from "@nextui-org/react";
const ChatListItem = ({ imageURL, itemName }) => {
  return (
    <div
      id="ChatListItem"
      className="w-full flex flex-col lg:flex-row items-center lg:gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-lg"
    >
      <div id="ChatListItemImage" className="">
        <Image
          alt="NextUI hero Image"
          src={imageURL}
          className="w-10 h-10 object-cover rounded-lg"
        />
      </div>
      <div
        id="ChatListItemInfo"
        className="h-full w-12 lg:w-full lg:max-w-2xl "
      >
        <h3 className=" text-xs text-center lg:text-xl lg:text-start font-semibold truncate ">
          {itemName}
        </h3>
      </div>
    </div>
  );
};

export default ChatListItem;
