import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Flex, FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "./LoginProvider";
import "../css/Scroll.css";

function LiveChatComp() {
  const { login } = useContext(LoginContext);
  let [client, changeClient] = useState(null);
  const [chat, setChat] = useState("");
  const [chatList, setChatList] = useState([]);

  const userId = useRef("");
  const fixScroll = useRef(null);

  if (login !== null) userId.current = login.nickName;
  else userId.current = "사용자";

  const CircularJSON = require("circular-json");

  const msgBox = chatList.map((item, idx) => {
    if (item.type !== "ENTER") {
      if (item.sender !== userId.current) {
        return (
          <Flex key={idx}>
            <Box>{item.sender} : </Box>
            <Box mr={"3px"}>{item.message}</Box>
            {/*<Box>{item.date}</Box>*/}
          </Flex>
        );
      } else {
        return (
          <Flex justifyContent={"right"} key={idx}>
            <Box>{item.message} : </Box>
            <Box mr={"3px"}>{item.sender}</Box>
            {/*<Box>{item.date}</Box>*/}
          </Flex>
        );
      }
    } else {
      return (
        <Flex justifyContent={"center"}>
          <Box>{item.message}</Box>
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

    client.deactivate();
  };

  const callback = function (message) {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setChatList((chats) => [...chats, msg]);
    }
  };

  const sendChat = (e, chat) => {
    e.preventDefault();
    if (chat !== "") {
      client.publish({
        destination: "/topic/chat/room",
        body: CircularJSON.stringify({
          type: "TALK",
          sender: userId.current,
          message: chat,
        }),
      });
    }

    setChat("");
  };

  useEffect(() => {
    connect();

    return () => disConnect();
  }, []);

  useEffect(() => {
    fixScroll.current.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  return (
    <Box
      width={"300px"}
      height={"500px"}
      position={"absolute"}
      right={"30px"}
      top={"250px"}
    >
      <Box
        className="scrollBox"
        overflowY={"auto"}
        border={"1px solid black"}
        height={"500px"}
      >
        {msgBox}
        <Box ref={fixScroll}></Box>
      </Box>
      <FormControl position={"relative"} bottom={0}>
        <Flex>
          <Input
            value={chat}
            placeholder="메시지 보내기"
            onChange={(e) => setChat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendChat(e, chat);
            }}
          />
          <Button onClick={(e) => sendChat(e, chat)}>전송</Button>
        </Flex>
      </FormControl>
    </Box>
  );
}

export default LiveChatComp;
