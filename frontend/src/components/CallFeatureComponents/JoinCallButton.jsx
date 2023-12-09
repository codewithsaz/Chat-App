import React from "react";
import { authToken, createMeeting } from "./API";

import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const JoinCallButton = ({ meetingID }) => {
  const navigate = useNavigate();

  async function handleJoinMetting() {
    const token = authToken;
    //create authToken,
    // validate MeetingID

    if (meetingID !== null) {
      navigate(`/chat/call/${meetingID}`);
    } else {
      window.alert("Meeting ID is NULL");
    }
  }
  return (
    <Button className=" rounded-lg " onClick={handleJoinMetting}>
      Join
    </Button>
  );
};

export default JoinCallButton;
