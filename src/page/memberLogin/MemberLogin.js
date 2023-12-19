import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Center,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLockOpen,
  faRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import FoundPassword from "./FoundPassword";
import MemberSignup from "./MemberSignup";
import { LoginContext } from "../../component/LoginProvider";
import KakaoLoginComp from "../../component/KakaoLoginComp";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { fetchLogin, isAuthenticated, connect } = useContext(LoginContext);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const fp = useDisclosure();
  const ms = useDisclosure();

  const navigate = useNavigate();

  const toast = useToast();

  let securityQuestionList = [
    "가장 좋아하는 색은 무엇입니까?",
    "가장 좋아하는 영화 제목은 무엇입니까?",
    "처음으로 가보았던 해변의 이름은 무엇입니까?",
    "가장 처음 가본 콘서트는 어떤 가수의 콘서트였습니까?",
  ];

  localStorage.setItem("securityQuestionList", securityQuestionList);

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(({ data }) => {
        connect(data.nickName);
        navigate("/main");
        toast({
          description: "로그인 되었습니다😀 ",
          status: "info",
        });
        onClose();
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 확인해주세요😥",
          status: "warning",
        });
      })
      .finally(() => {
        fetchLogin();
      });
  }

  return (
    <Center>
      {isAuthenticated() || (
        <Button colorScheme="purple" mt={600} onClick={onOpen}>
          <FontAwesomeIcon icon={faRightToBracket} />
          로그인
        </Button>
      )}

      {/* 로그인 창 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader fontSize={"small"}>로그인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Center mb={10}>
                <Box
                  width={"150px"}
                  height={"150px"}
                  bgImage={`url(${process.env.PUBLIC_URL}/img/RelieveYellow.png)`}
                  backgroundSize={"100%"}
                />
              </Center>
            </Box>
            <FormControl mb={3}>
              <FormLabel>아이디</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FontAwesomeIcon icon={faUser} />
                </InputLeftElement>

                <Input
                  placeholder="ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FontAwesomeIcon icon={faLockOpen} />
                </InputLeftElement>

                <Input
                  placeholder="PASSWORD"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              w={"250px"}
              mr={3}
              onClick={handleLogin}
              colorScheme="purple"
            >
              로그인
            </Button>
            <KakaoLoginComp />
          </ModalFooter>
          <ModalFooter mb={2}>
            <Button
              w={"150px"}
              size={"xs"}
              mr={2}
              onClick={() => {
                fp.onOpen();
              }}
            >
              비밀번호 찾기
            </Button>
            <Button
              w={"150px"}
              size={"xs"}
              onClick={() => {
                ms.onOpen();
              }}
            >
              회원가입
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FoundPassword
        isOpen={fp.isOpen}
        onClose={fp.onClose}
        securityQuestions={securityQuestionList}
      />
      <MemberSignup
        securityQuestionList={securityQuestionList}
        isOpen={ms.isOpen}
        onClose={ms.onClose}
      />
    </Center>
  );
}
