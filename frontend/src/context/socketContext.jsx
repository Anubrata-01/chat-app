/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { HOST } from "@/constant";
import { userInfoAtom } from "@/stores/auth-slice";
import { useAtom } from "jotai";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [userInfo] = useAtom(userInfoAtom);
  const [chatHistory, setChatHistory] = useState({});

  useEffect(() => {
    if (userInfo?.user) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.user._id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from the socket server");
      });

      const handleReceiveMessage = (message) => {
        console.log("Received message:", message); 
        setChatHistory((prevHistory) => ({
          ...prevHistory,
          [message.senderId]: [...(prevHistory[message.senderId] || []), message],
        }));
      };

      socket.current.on("receive_message", handleReceiveMessage);
    
      return () => {
        if (socket.current) {
          socket.current.off("receive_message", handleReceiveMessage);

          socket.current.disconnect();
        }
      };
    }
  }, [userInfo]);



  const sendMessage = (recipientId, content) => {
    const senderId = userInfo?.user._id;
    if (socket.current && senderId) {
      const timestamp = new Date().toISOString();
      const newMessage = {
        senderId,
        recipientId,
        content,
        messageType: "text",
        timestamp,
      };
      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [recipientId]: [...(prevHistory[recipientId] || []), newMessage],
      }));
      socket.current.emit(
        "send_message",
        newMessage,
        (response) => {
          if (response.status !== "ok") {
            console.error("Failed to send message:", response);
          }
        }
      );
    }
  };
  
  
  return (
    <SocketContext.Provider value={{ socket: socket.current, sendMessage, chatHistory }}>
      {children}
    </SocketContext.Provider>
  );
};

