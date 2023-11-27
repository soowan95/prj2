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
import { LoginContext } from "./App";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { fetchLogin, isAuthenticated } = useContext(LoginContext);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const navigate = useNavigate();
  const toast = useToast();

  // handleSubmit
  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
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

  function handleSearchPassword() {
    axios
      .post("/api/member/update-password", {})
      .then(console.log("일치"))
      .finally(console.log("불일치"));
  }

  function handleSingUp() {
    axios.post("/api/member/signup");
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
            <Button size={"xs"} mr={1} onClick={handleSearchPassword}>
              비밀번호찾기
            </Button>
            <Button size={"xs"} onClick={handleSingUp}>
              회원가입
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
