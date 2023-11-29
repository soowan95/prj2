import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef } from "react";
import { LoginContext } from "./LoginProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SongRequestComp() {
  const requestTitle = useRef("");
  const requestArtist = useRef("");

  const songRequestModal = useDisclosure();

  const { login, isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

  const navigate = useNavigate();

  // 없는 곡 요청 보내기, 빈칸은 요청 안됨
  function handleSongRequestButton() {
    axios
      .post("/api/song/request", {
        title: requestTitle.current,
        artist: requestArtist.current,
        member: login.id,
      })
      .then(() => {
        navigate("/main");
        toast({
          description: "요청 됐습니다.",
          status: "success",
        });
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            description: "제목 또는 가수를 입력해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "로그인 후 요청 보내주세요.",
            status: "warning",
          });
        }
      });
  }

  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Box>일치하는 정보가 없습니다. 요청을 원하시면</Box>
      <Tooltip label={"로그인 후 요청해주세요."} isDisabled={isAuthenticated()}>
        <Button
          onClick={songRequestModal.onOpen}
          isDisabled={!isAuthenticated()}
        >
          여기
        </Button>
      </Tooltip>
      <Box>를 클릭해주세요.</Box>
      <Modal
        isOpen={songRequestModal.isOpen}
        onClose={songRequestModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>요청 정보를 입력해주세요.</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input
                onChange={(e) => (requestTitle.current = e.target.value)}
              />
              <FormLabel mt={5}>가수</FormLabel>
              <Input
                onChange={(e) => (requestArtist.current = e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSongRequestButton}>요청</Button>
            <Button onClick={songRequestModal.onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default SongRequestComp;
