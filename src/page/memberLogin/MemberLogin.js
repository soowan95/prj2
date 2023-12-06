import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
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
  Card,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faLockOpen,
  faRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PasswordRecovery from "./PasswordRecovery";
import FoundPassword from "./FoundPassword";
import MemberSignup from "./MemberSignup";
import { LoginContext } from "../../component/LoginProvider";
import KakaoLoginComp from "../../component/KakaoLoginComp";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { fetchLogin, isAuthenticated } = useContext(LoginContext);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const fp = useDisclosure();
  const pr = useDisclosure();
  const ms = useDisclosure();

  const navigate = useNavigate();

  const toast = useToast();

  let securityQuestionList = [
    "가장 좋아하는 색은 무엇입니까?",
    "가장 좋아하는 영화 제목은 무엇입니까?",
    "처음으로 가보았던 해변의 이름은 무엇입니까?",
    "가장 처음 가본 콘서트는 어떤 가수의 콘서트였습니까?",
  ];

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        navigate("/main");
        toast({
          description: "로그인 되었습니다😀 ",
          status: "info",
        });
        onClose();
        window.location.reload(0);
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
        <Button colorScheme="purple" mr={5} onClick={onOpen}>
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
              <Center mb={20} fontSize={"xx-large"}>
                R E L I E V E
              </Center>
            </Box>
            <FormControl mb={5}>
              <FormLabel>아이디</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FontAwesomeIcon icon={faUser} />
                </InputLeftElement>

                <Input
                  placeholder="ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mb={5}>
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
          <ModalFooter>
            <Button
              w={"150px"}
              size={"xs"}
              mr={1}
              onClick={() => {
                fp.onOpen();
              }}
            >
              비밀번호 찾기
            </Button>
            <Button
              w={"150px"}
              size={"xs"}
              mr={1}
              onClick={() => {
                pr.onOpen();
              }}
            >
              비밀번호 재설정
            </Button>
            <Button
              w={"100px"}
              size={"xs"}
              mr={1}
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
      <PasswordRecovery
        isOpen={pr.isOpen}
        onClose={pr.onClose}
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
