"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io(
  "https://cuddly-computing-machine-7v999jrx43g4p-3001.app.github.dev"
);

type WebRTCProps = {
  initiator?: boolean;
};

export const WebRTC = ({ initiator = false }: WebRTCProps) => {
  const [answer, setAnswer] = useState(null);
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // only one peer is allowed to be the inititator
  const peer = useMemo(
    () => new SimplePeer({ initiator: initiator, trickle: true }),
    [initiator]
  );

  const sendMsg = () => {
    peer.send("Hello world");
  };

  useEffect(() => {
    const handleSignal = (data) => {
      socket.emit("signal", data);
    };

    const handleAnswer = (data) => {
      setAnswer(data);
    };

    const handleConnect = () => {
      console.log("Connected");
      setConnected(true);
      initVideoStream(); // Start video streaming after connecting
    };

    const handleData = (data) => {
      console.log("Data: ", data);
    };

    peer.on("signal", handleSignal);
    socket.on("signal", handleAnswer);
    // Handle incoming ICE candidates
    socket.on("ice-candidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });

    peer.on("connect", handleConnect);
    peer.on("data", handleData);

    if (answer) {
      peer.signal(answer);
    }

    // Clean up event listeners
    return () => {
      peer.removeListener("signal", handleSignal);
      socket.removeListener("signal", handleAnswer);
      peer.removeListener("connect", handleConnect);
      peer.removeListener("data", handleData);
    };
  }, [peer, answer]);

  // Function to handle video streaming
  const initVideoStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        peer.addStream(stream);

        // Listen for remote video stream

        peer.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };



  return (
    <>
      <video ref={localVideoRef} autoPlay></video>
      {connected && <video ref={remoteVideoRef} autoPlay></video>}

      <button onClick={sendMsg}>sendMSg</button>
    </>
  );
};
