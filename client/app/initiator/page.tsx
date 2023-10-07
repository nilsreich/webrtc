"use client";
import { useMemo, useEffect, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io(
  "https://cuddly-computing-machine-7v999jrx43g4p-3001.app.github.dev"
);

export default function Home() {
    const [answer, setAnswer] = useState(null);
  
    const peer = useMemo(
      () => new SimplePeer({ initiator: true, trickle: false }),
      []
    );
  
    const sendMsg = () => {
      peer.send("Hello world");
    };
  
    useEffect(() => {
      const handleSignal = (data) => {
        socket.emit("offer", data);
        console.log("offer sent");
      };
  
      const handleAnswer = (data) => {
        console.log("answer received");
        setAnswer(data);
      };
  
      const handleConnect = () => {
        console.log("Connected");
      };
  
      const handleData = (data) => {
        console.log("Data: ", data);
      };
  
      peer.on("signal", handleSignal);
      socket.on("answer", handleAnswer);
      peer.on("connect", handleConnect);
      peer.on("data", handleData);
  
      if (answer) {
        peer.signal(answer);
      }
  
      // Clean up event listeners
      return () => {
        peer.removeListener("signal", handleSignal);
        socket.removeListener("answer", handleAnswer);
        peer.removeListener("connect", handleConnect);
        peer.removeListener("data", handleData);
      };
    }, [peer, answer]);

  return (
    <>
      <button onClick={sendMsg}>sendMSg</button>
    </>
  );
}
