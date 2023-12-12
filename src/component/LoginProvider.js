import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import CircularJSON from "circular-json";

export const LoginContext = createContext(null);
function LogInProvider({ children }) {
  const [login, setLogin] = useState("");

  function requestList() {
    if (isAdmin()) {
      // 관리자일 때만 요청을 보냅니다.
      axios
        .get("/api/requestList")
        .then((response) => {
          // 요청에 대한 처리를 진행
          console.log("Request List:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching request list:", error);
        });
    } else {
      // 관리자가 아닌 경우에는 권한이 없음을 알리는 메시지를 출력
      console.log("관리자만 요청 목록을 볼 수 있습니다.");
    }
  }

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => {
      setLogin(response.data);
      userId.current = response.data.nickName;
    });
  }

  function isAuthenticated() {
    return login !== "";
  }

  function isAdmin() {
    console.log(login);
    if (login.auth) {
      return login.auth.some((elem) => elem.name === "admin");
    }

    return false;
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

  const CircularJSON = require("circular-json");

  const msgBox = chatList.map((item, idx) => {
    if (item.type !== "ENTER" && item.type !== "LEAVE") {
      if (item.sender !== userId.current) {
        return (
          <Flex key={idx}>
            <Wrap mx={"5px"}>
              <WrapItem>
                <Avatar size={"xs"} name={item.sender}>
                  <AvatarBadge
                    boxSize={"0.5rem"}
                    bg={item.isOnline ? "green" : "red"}
                  />
                </Avatar>
              </WrapItem>
            </Wrap>
            <Box fontSize={"0.9rem"} mr={"3px"}>
              : {item.message}
            </Box>
            {/*<Box>{item.date}</Box>*/}
          </Flex>
        );
      } else {
        return (
          <Flex justifyContent={"right"} key={idx}>
            <Box fontSize={"0.9rem"}>{item.message} : </Box>
            <Wrap mx={"5px"}>
              <WrapItem>
                <Avatar size={"xs"} name={item.sender}>
                  <AvatarBadge
                    boxSize={"0.5rem"}
                    bg={item.isOnline ? "green" : "red"}
                  />
                </Avatar>
              </WrapItem>
            </Wrap>
            {/*<Box>{item.date}</Box>*/}
          </Flex>
        );
      }
    } else {
      return (
        <Flex justifyContent={"center"}>
          <Box fontSize={"0.9rem"}>{item.message}</Box>
        </Flex>
      );
    }
  });

  const connect = () => {
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
          sender: userId.current,
        }),
      });
    };

    clientdata.onStompError = function (frame) {
      console.log("Broker repoerted error: " + frame.headers["message"]);
      console.log("Additional details" + frame.body);
    };

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

  const fixScroll = useRef(null);

  useEffect(() => {
    fixScroll.current.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  useEffect(() => {
    connect();

    return () => disConnect();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        login,
        fetchLogin,
        isAuthenticated,
        hasAccess,
        isAdmin,
        connect,
        disConnect,
        setChat,
        chat,
        sendChat,
        msgBox,
        fixScroll,
        requestList,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LogInProvider;
