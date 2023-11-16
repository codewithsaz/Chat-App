import React from "react";
import { Image } from "@nextui-org/react";

const RecieverChatBox = ({
  senderName,
  messageText,
  mediaURL,
  messageTime,
}) => {
  return (
    <div className="w-full flex items-center justify-start px-4 py-2 ">
      <div className="w-auto min-w-[10rem] flex flex-col max-w-xs md:max-w-xl  rounded-r-xl rounded-tl-xl px-2 py-1 bg-zinc-200 dark:bg-zinc-700">
        <h6 className="w-full font-semibold">{senderName}</h6>
        {mediaURL && (
          <Image
            alt="NextUI hero Image"
            src={mediaURL}
            className=" max-h-40 w-full object-cover rounded-lg"
          />
        )}
        <p className=" break-words">{messageText}</p>
        <p className="w-full text-xs font-semibold text-end">{messageTime}</p>
      </div>
    </div>
  );
};

export default RecieverChatBox;
