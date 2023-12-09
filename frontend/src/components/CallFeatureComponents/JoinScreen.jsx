import React, { useState } from "react";
import CreateCallButton from "./CreateCallButton";
import JoinCallButton from "./JoinCallButton";
import { useParams } from "react-router-dom";
import { Input } from "@nextui-org/react";

const JoinScreen = () => {
  const [meetingId, setMeetingId] = useState(null);

  return (
    <div className="w-full flex flex-col gap-2 h-screen items-center justify-center p-2">
      <div className="w-full max-w-sm flex flex-col gap-2">
        <Input
          size="sm"
          type="text"
          placeholder="Enter Meeting Id"
          className=""
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <div className="w-full h-max items-center justify-center flex gap-2">
          <JoinCallButton meetingID={meetingId} />
          <CreateCallButton insideContent="Create Meet" />
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
