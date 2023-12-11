import { useContext, useState } from "react";
import { Box, Button, Flex, FormControl, Input } from "@chakra-ui/react";
import { LoginContext } from "./LoginProvider";
import "../css/Scroll.css";
import {
  faCommentDots,
  faEllipsis,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDrag } from "react-use-gesture";

function LiveChatComp() {
  const { isAuthenticated, chat, sendChat, setChat, msgBox, fixScroll } =
    useContext(LoginContext);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMove, setIsMove] = useState(false);
  const [chatVisible, setChatVisible] = useState("none");

  const move = useDrag((e) => {
    if (isMove)
      setPos({
        x: e.offset[0] / 19,
        y: e.offset[1] / 20,
      });
  });

  return (
    <>
      <Box
        position={"fixed"}
        left={"96%"}
        top={"15%"}
        display={chatVisible === "none" ? "block" : "none"}
      >
        <Button
          onClick={() => setChatVisible("block")}
          _hover={{ bg: "none" }}
          fontSize={"1.5rem"}
        >
          <FontAwesomeIcon icon={faCommentDots} />
        </Button>
      </Box>
      <Box
        {...move()}
        display={chatVisible}
        className="chatBox"
        bg={"white"}
        width={"200px"}
        height={"500px"}
        position={"absolute"}
        left={pos.x + 88 + "%"}
        top={pos.y + 10 + "%"}
      >
        <Box
          onMouseOver={() => setIsMove(true)}
          onMouseLeave={() => setIsMove(false)}
          opacity={0}
          className="moveIcon"
          position={"relative"}
          left={"50%"}
          w={"20px"}
          h={"3%"}
          cursor={"grab"}
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </Box>
        <Box
          position={"relative"}
          left={"90%"}
          w={"20px"}
          h={"3%"}
          lineHeight={"10px"}
          onClick={() => setChatVisible("none")}
        >
          <FontAwesomeIcon icon={faMinus} />
        </Box>
        <Box
          className="scrollBox"
          overflowY={"auto"}
          border={"1px solid black"}
          height={"85%"}
          width={"100%"}
        >
          {msgBox}
          <Box ref={fixScroll}></Box>
        </Box>
        <FormControl position={"relative"} bottom={0}>
          <Flex w={"100%"} h={"10%"}>
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
    </>
  );
}

export default LiveChatComp;
