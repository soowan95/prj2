import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { LoginContext } from "./LoginProvider";
import "../css/Scroll.css";
import {
  faCommentDots,
  faEllipsis,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDrag } from "react-use-gesture";

function LiveChatComp(toggle) {
  const {
    isAuthenticated,
    chat,
    sendChat,
    setChat,
    chatList,
    userId,
    setChatList,
  } = useContext(LoginContext);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMove, setIsMove] = useState(false);
  const [chatVisible, setChatVisible] = useState("none");

  const move = useDrag((e) => {
    if (isMove)
      setPos({
        x: e.offset[0] / 19,
        y: e.offset[1] / 9,
      });
  });

  const msgBox = chatList.map((item, idx) => {
    if (item.type !== "ENTER" && item.type !== "LEAVE") {
      if (item.sender !== userId.current) {
        if (
          chatList.at(idx - 1).sender !== item.sender ||
          chatList.at(idx - 1).type === "ENTER" ||
          idx <= 1
        ) {
          return (
            <Box>
              <Flex key={idx}>
                <Avatar
                  size={"sm"}
                  ml={2}
                  name={item.sender}
                  src={item.profile}
                >
                  <AvatarBadge
                    // style={{ left: "10px" }}
                    boxSize={"0.6rem"}
                    bg={item.isOnline ? "green" : "red"}
                    border={"none"}
                  />
                </Avatar>
                <Box
                  fontSize={"0.9rem"}
                  ml={1}
                  lineHeight={"30px"}
                  fontWeight={"bold"}
                >
                  {item.sender}
                </Box>
              </Flex>
              <Box
                ml={8}
                mt={1}
                mb={1}
                w={"fit-content"}
                style={{
                  color: "black",
                  backgroundColor:
                    localStorage.getItem("chakra-ui-color-mode") === "dark"
                      ? "#fcf4db"
                      : "#fbe6f2",
                  borderRadius: "20px",
                  whiteSpace: "normal",
                  maxWidth: "200px",
                  height: "auto",
                }}
              >
                <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {item.message}
                </div>
              </Box>
            </Box>
          );
        } else {
          return (
            <Flex key={idx}>
              <Box
                ml={8}
                mb={1}
                w={"fit-content"}
                h={"25px"}
                style={{
                  color: "black",
                  backgroundColor:
                    localStorage.getItem("chakra-ui-color-mode") === "dark"
                      ? "#fcf4db"
                      : "#fbe6f2",
                  borderRadius: "20px",
                  whiteSpace: "normal",
                  width: "auto",
                  maxWidth: "200px",
                  height: "auto",
                }}
              >
                <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {item.message}
                </div>
              </Box>
            </Flex>
          );
        }
      } else {
        return (
          <Flex justifyContent={"right"} key={idx}>
            <Box
              w={"fit-content"}
              h={"25px"}
              mb={1}
              style={{
                color: "white",
                backgroundColor:
                  localStorage.getItem("chakra-ui-color-mode") === "dark"
                    ? "#f3cd5d"
                    : "#e86db3",
                borderRadius: "20px",
                whiteSpace: "normal",
                width: "auto",
                maxWidth: "200px",
                height: "auto",
              }}
              mr={3}
            >
              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                {item.message}
              </div>
            </Box>
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

  const fixScroll = useRef(null);

  useEffect(() => {
    fixScroll.current.scrollIntoView(false);
  }, [chatList]);

  return (
    <>
      <Box
        position={"fixed"}
        left={"96%"}
        top={"15%"}
        display={chatVisible === "none" ? "block" : "none"}
      >
        <Button
          bg={"none"}
          _hover={{ bg: "none" }}
          onClick={() => setChatVisible("block")}
          fontSize={"1.5rem"}
        >
          {localStorage.getItem("chakra-ui-color-mode") === "dark" ? (
            <FontAwesomeIcon
              icon={faCommentDots}
              style={{ color: "#f2c84b" }}
            />
          ) : (
            <FontAwesomeIcon icon={faCommentDots} style={{ color: "white" }} />
          )}
        </Button>
      </Box>
      <Box
        {...move()}
        display={chatVisible}
        className="chatBox"
        bg={
          localStorage.getItem("chakra-ui-color-mode") === "dark"
            ? "#e8d087"
            : "#f3b6d9"
        }
        width={"270px"}
        height={"500px"}
        position={"fixed"}
        left={pos.x + 86 + "%"}
        top={pos.y + 20 + "%"}
        borderRadius={20}
      >
        <Flex>
          <Box
            position={"relative"}
            left={"3%"}
            top={"5px"}
            fontSize={"0.7rem"}
            color={"black"}
          >
            접속자 :{" "}
            {chatList.length !== 0 &&
              chatList.at(chatList.length - 1).onlineCount}
          </Box>
          <Box
            onMouseOver={() => setIsMove(true)}
            onMouseLeave={() => setIsMove(false)}
            opacity={0}
            className="moveIcon"
            position={"relative"}
            left={"35%"}
            w={"20px"}
            h={"3%"}
            cursor={"grab"}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </Box>
          <Box
            position={"relative"}
            left={"65%"}
            top={"5px"}
            w={"20px"}
            h={"3%"}
            lineHeight={"10px"}
            onClick={() => setChatVisible("none")}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Box>
        </Flex>
        <Box
          className="scrollBox"
          overflowY={"auto"}
          // border={"1px solid black"}
          height={"85%"}
          width={"100%"}
        >
          {msgBox}
          <Box ref={fixScroll}></Box>
        </Box>
        <FormControl position={"relative"} bottom={0}>
          <Flex
            justifyContent="center"
            textAlign={"center"}
            w={"90%"}
            mx="auto"
            h={"10%"}
          >
            <Input
              value={chat}
              placeholder="메시지 보내기"
              onChange={(e) => setChat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (chat === "/c" || chat === "/clear") {
                    setChat("");
                    setChatList([]);
                  } else sendChat(e, chat);
                } else if (e.key === "Escape") setChatVisible("none");
              }}
              _focus={{
                borderColor: "transparent",
              }}
            />
            <Button
              isDisabled={!isAuthenticated()}
              onClick={(e) => {
                if (chat === "/c" || chat === "/clear") {
                  setChat("");
                  setChatList([]);
                } else sendChat(e, chat);
              }}
              backgroundColor={
                localStorage.getItem("chakra-ui-color-mode") === "dark"
                  ? "#f3cd5d"
                  : "#e86db3"
              }
            >
              전송
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </>
  );
}

export default LiveChatComp;
