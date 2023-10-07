"use client";
import { WebRTC } from "@/components/WebRTC";
import { useState } from "react";

export default function Home() {
const [value, setValue]=useState(null)

  return (
    <>
    <button onClick={()=>startCall()}>start call</button>
    <button onClick={()=>recieveCall()}>recieve call</button>
      { value && <WebRTC initiator={value}/>}
    </>
  );
}
