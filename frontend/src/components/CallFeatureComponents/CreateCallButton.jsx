import React from "react";
import { authToken, createMeeting } from "./API";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { socket } from "../../socket";

const CreateCallButton = ({ groupDetails, groupID, insideContent }) => {
  let groupOBJ = null;
  if (groupDetails) {
    groupOBJ = {
      name: groupDetails.name,
      iconURL: groupDetails.iconURL,
    };
  }

  const navigate = useNavigate();
  function handleMakeCallRealTIme(groupDetail, meetingID, room) {
    console.log("created call");
    socket.emit("create_call", { ...groupDetail, meetingID, room });
  }

  async function handleCreateMetting() {
    const token = authToken;
    const meetingID = await createMeeting({ token: authToken });

    if (meetingID !== undefined) {
      groupOBJ && handleMakeCallRealTIme(groupOBJ, meetingID, groupID);
      navigate(`/chat/call/${meetingID}`);
    }
  }
  return (
    <Button className=" rounded-lg " onClick={handleCreateMetting}>
      {insideContent}
    </Button>
  );
};

export default CreateCallButton;
