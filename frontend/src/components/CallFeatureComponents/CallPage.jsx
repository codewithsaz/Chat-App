import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import ReactPlayer from "react-player";
import useUserStore from "../../store/userStore";
import { useParams, useNavigate } from "react-router-dom";
import CreateCallButton from "./CreateCallButton";

function ParticipantView(props) {
  const micRef = useRef(null);
  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    setQuality,
    getVideoStats,
    participant,
  } = useParticipant(props.participantId);

  setQuality("high");
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <Card className="min-w-full flex flex-col gap-1  rounded-lg p-2 max-w-xs ">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"100%"}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div className="w-full h-full  flex items-center text-center justify-center">
          No Feed
        </div>
      )}
      <div className="w-full h-max flex items-center justify-between">
        <p className="w-full capitalize font-bold text-sm">
          {isLocal ? "You" : displayName}
        </p>
        <div className="w-max flex gap-2">
          <Chip
            size="sm"
            color={micOn ? "success" : "danger"}
            variant="dot"
            className="border-0 p-1 bg-zinc-300 dark:bg-zinc-700"
          >
            <Icon icon="fontisto:mic" width={10} height={20} />
          </Chip>
          <Chip
            size="sm"
            color={webcamOn ? "success" : "danger"}
            variant="dot"
            className="border-0 p-1 bg-zinc-300 dark:bg-zinc-700"
          >
            <Icon icon="streamline:webcam-video-solid" width="10" height="20" />
          </Chip>
        </div>
        {/* {displayName} | C: {webcamOn ? "ON" : "OFF"} | M: {micOn ? "ON" : "OFF"} */}
      </div>
    </Card>
  );
}

function Controls() {
  const { leave, toggleMic, micOn, webcamOn, toggleWebcam, end } = useMeeting();
  return (
    <div className="w-full flex items-center justify-center h-16 gap-2 overflow-x-auto p-2 rounded-lg">
      <Button color="danger" className="" onClick={() => leave()}>
        Leave
      </Button>
      <Button className="" onClick={() => toggleMic()}>
        {micOn ? (
          <Icon icon="material-symbols:mic-off" width="20" height="20" />
        ) : (
          <Icon icon="fluent:mic-on-24-filled" width="20" height="20" />
        )}
      </Button>
      <Button className="" onClick={() => toggleWebcam()}>
        {webcamOn ? (
          <Icon
            icon="streamline:webcam-video-off-solid"
            width="20"
            height="20"
          />
        ) : (
          <Icon icon="streamline:webcam-video-solid" width="20" height="20" />
        )}
      </Button>
      <Button color="danger" className="" onClick={() => end()}>
        End
      </Button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
  const getMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true, // Request access to the camera
        audio: true, // Request access to the microphone
      });

      setStream(mediaStream);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    // Call the getMedia function when the component mounts
    getMedia();

    // Clean up the stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className=" w-full h-full flex flex-col items-center justify-center p-2">
      {joined && joined == "JOINED" ? (
        <div className="w-full h-full flex flex-col">
          <h3>Meeting Id: {props.meetingId}</h3>

          <div
            className="h-full gap-2 text-lg md:text-xl lg:text-2xl overflow-y-auto p-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(15em, 1fr))",
            }}
          >
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
          <Controls />
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <div>
          {error && <p>Error: {error}</p>}
          {stream && (
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold">Camera and Mic Connected</p>
              <Button onClick={joinMeeting}>Join Call</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const CallPage = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const [meetingId, setMeetingId] = useState(roomID);
  let name = user.name;
  console.log(user);
  //Getting the meeting id by calling the api we just wrote

  const getMeetingAndToken = async (id) => {
    const meetingId = roomID;
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    navigate(`/chat/personal`, { replace: true });
    setMeetingId(null);
  };

  return (
    <div className="w-full h-full">
      {/* {authToken && meetingId ? ( */}
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: name,
          quality: "high",
        }}
        token={authToken}
        // joinWithoutUserInteraction
      >
        <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
      </MeetingProvider>
      {/* ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken} />
      )} */}
    </div>
  );
};

export default CallPage;
