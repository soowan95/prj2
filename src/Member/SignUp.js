import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


export function SignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const {isOpen, onClose, onOpen} = useDisclosure();

  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  let submitAvailable = true;

  if (!emailAvailable) {
    submitAvailable = false;
  }

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  if (!nickNameAvailable) {
    submitAvailable = false;
  }

  function handleCheckId() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "Unavailable ID",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "Available ID",
            status: "success",
          });
        }
      });
  }

  function handleCheckNickname() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "Unavailable Nickname",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "Available Nickname",
            status: "success",
          });
        }
      });
  }

  function handleCheckEmail() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "Unavailable Email",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "Available Email",
            status: "success",
          });
        }
      });
  }

  function handleSignup() {
    axios.post("/api/member/signup", {
      id,
      password,
      nickName,
      email
    })
      .then(() => {
        toast({
          description: "Sign up successfully",
          status: "success"
        })
        onClose();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "error"
          })
        } else {
          toast({
            description: "가입 중에 오류가 발생하였습니다",
            status: "error"
          })
          onClose();
        }
      });
  }

  return (
    <>
      <Button w="100%" colorScheme="gray" onClick={onOpen}>
        SIGN IN
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Sign Up</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Text>ID</Text>
            <Flex gap={3}>
              <Input w="50%" value={id} onChange={(e) => setId(e.target.value)}/>
              <Button onClick={handleCheckId}>중복확인</Button>
            </Flex>

            <Text>PASSWORD</Text>
            <Input w="50%" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Text>PASSWORD 확인</Text>
            <Input w="50%" type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)}/>
            <Text>NICKNAME</Text>
            <Flex gap={3}>
              <Input w="50%" value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder="Nickname 입력"/>
              <Button onClick={handleCheckNickname}>중복확인</Button>
            </Flex>
            <Text>EMAIL</Text>
            <Flex gap={3}>
              <Input w="50%" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email 입력"/>
              <Button onClick={handleCheckEmail}>중복확인</Button>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button w="100%" colorScheme="facebook" onClick={handleSignup}>
              SIGN IN
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
}
