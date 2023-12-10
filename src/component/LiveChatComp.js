import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { LoginContext } from "./LoginProvider";
import "../css/Scroll.css";
import { faGripLines, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LiveChatComp() {
  const { isAuthenticated, chat, sendChat, setChat, msgBox, fixScroll } =
    useContext(LoginContext);

  return (
    <Box
      bg={"white"}
      width={"200px"}
      height={"500px"}
      position={"absolute"}
      right={"2%"}
      top={"250px"}
    >
      <Flex position={"relative"} left={"80%"} w={"20px"}>
        <Box>
          <FontAwesomeIcon icon={faGripLines} />
        </Box>
        <Box>
          <FontAwesomeIcon icon={faMinus} />
        </Box>
      </Flex>
      <Box
        className="scrollBox"
        overflowY={"auto"}
        border={"1px solid black"}
        height={"500px"}
        width={"200px"}
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
          <Button
            isDisabled={!isAuthenticated()}
            onClick={(e) => sendChat(e, chat)}
          >
            전송
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
}

export default LiveChatComp;
