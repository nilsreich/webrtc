"use client";
import { WebRTC } from "@/components/WebRTC";
import { useState } from "react";

export default function Home() {
const [value, setValue]=useState(false)

const startCall=()=>{
  setValue(true)
}

  return (
    <>
    <button onClick={()=>startCall()}>start call</button>
      { value && <WebRTC initiator={value}/>}
      { !value && <WebRTC initiator={value}/>}
    </>
  );
}
