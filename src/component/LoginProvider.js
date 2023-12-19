import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

export const LoginContext = createContext(null);
function LogInProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => {
      setLogin(response.data);
      userId.current = response.data.nickName;
      localStorage.setItem("admin", response.data.admin);
    });
  }

  function isAuthenticated() {
    return login !== "";
  }

  function isAdmin() {
    return localStorage.getItem("admin") === "true";
  }

  // function isManager() {
  //   return login.auth.some((elem) => elem.name === "manager");
  // }
  //
  // function hasAuth(auth) {
  //   return login.auth.some((elem) => elem.name === auth);
  // }

  function hasAccess(userId) {
    return login.id === userId;
  }

  let [client, changeClient] = useState(null);
  const [chat, setChat] = useState("");
  const [chatList, setChatList] = useState([]);

  const userId = useRef(login.nickName);

  useEffect(() => {
    if (chatList.length > 0) {
      for (let i = 0; i < chatList.length; i++) {
        chatList.at(i).isOnline =
          chatList
            .at(chatList.length - 1)
            .isOnline.indexOf(chatList.at(i).sender) !== -1;
      }
    }
  }, [chatList]);

  useEffect(() => {
    if (localStorage.getItem("login")) connect(localStorage.getItem("login"));

    return () => disConnect();
  }, []);

  const CircularJSON = require("circular-json");

  const connect = (nickName) => {
    const clientdata = new StompJs.Client({
      brokerURL: "ws://localhost:8080/ws/chat",
      connectHeaders: {
        login: "user",
        passcode: "password",
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    clientdata.webSocketFactory = function () {
      return new SockJS("http://localhost:8080/ws/chat");
    };

    clientdata.onConnect = function () {
      clientdata.subscribe("/topic/chat/room", callback);
      clientdata.publish({
        destination: "/app/chat/enter",
        body: CircularJSON.stringify({
          type: "ENTER",
          sender: nickName,
        }),
      });
    };

    clientdata.onStompError = function (frame) {
      console.log("Broker repoerted error: " + frame.headers["message"]);
      console.log("Additional details" + frame.body);
    };

    localStorage.setItem("login", nickName);

    clientdata.activate();
    changeClient(clientdata);
  };

  const disConnect = () => {
    if (client === null) return;

    client.publish({
      destination: "/app/chat/leave",
      body: CircularJSON.stringify({
        type: "LEAVE",
        sender: userId.current,
      }),
    });

    localStorage.removeItem("login");

    client.unsubscribe();
    client.deactivate();
  };

  const callback = function (message) {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setChatList((chats) => [...chats, msg]);
    }
  };

  const sendChat = (e, chat) => {
    if (chat !== "") {
      client.publish({
        destination: "/app/chat/msg",
        body: CircularJSON.stringify({
          type: "TALK",
          sender: userId.current,
          message: chat,
        }),
      });
    }

    setChat("");
  };

  return (
    <LoginContext.Provider
      value={{
        login,
        fetchLogin,
        isAuthenticated,
        hasAccess,
        isAdmin,
        setLogin,
        connect,
        disConnect,
        setChat,
        chat,
        sendChat,
        chatList,
        userId,
        setChatList,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LogInProvider;
