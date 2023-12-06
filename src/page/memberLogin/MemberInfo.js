import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordRecovery from "./PasswordRecovery";

export function MemberInfo() {
  const { fetchLogin, login } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPasswordModalOpen,
    onOpen: onPasswordModalOpen,
    onClose: onPasswordModalClose,
  } = useDisclosure();
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [params] = useSearchParams();

  useEffect(() => {
    axios.get("/api/member" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  //기존 이메일과 같은지 확인
  let sameOriginEmail = false;
  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  let emailChecked = sameOriginEmail || emailAvailable;

  //기존 별명과 같은지 확인
  let sameOriginNickName = false;
  if (member !== null) {
    sameOriginNickName = member.nickName === email;
  }

  let nickNameChecked = sameOriginNickName || nickNameAvailable;

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(true);
        toast({
          description: "이미 사용중인 닉네임입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "사용 가능한 별명입니다.",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        toast({
          description: "이미 사용중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  function handleSubmit() {
    axios
      .put("/api/member/edit", {
        id: login.id,
        email,
        nickName,
      })
      .then(() => {
        toast({
          description: "수정되었습니다",
          status: "success",
        });
        onClose();
        window.location.reload(0);
      })
      .catch((error) => console.log(error));
  }

  return (
    <Center mt={50}>
      <Card mt={50} w="2xl" h="2xl">
        <CardHeader>
          <Heading>{login.nickName} 님</Heading>
        </CardHeader>
        <CardBody style={{ textAlign: "center" }}>
          <Flex gap={5}>
            <Card w="sm" h="250px">
              <CardBody mt={50}>나의 정보를 수정합니다.</CardBody>
              <CardFooter>
                <Button colorScheme="facebook" onClick={onOpen}>
                  개인정보 수정
                </Button>
              </CardFooter>
            </Card>
            <Card w="sm" h="250px">
              <CardBody mt={50}>내가 좋아하는 플레이리스트</CardBody>
              <CardFooter>
                <Button
                  colorScheme="facebook"
                  onClick={() => navigate("/main/myFavorite")}
                >
                  좋아요 표시한 플레이리스트
                </Button>
              </CardFooter>
            </Card>
          </Flex>
          <br />
          <Flex gap={5}>
            <Card w="sm" h="250px">
              <CardBody mt={50}>내가 좋아하는 음악</CardBody>
              <CardFooter>
                <Button colorScheme="facebook">좋아요 표시한 음악</Button>
              </CardFooter>
            </Card>
            <Card w="sm" h="250px">
              <CardBody mt={50}>RELIEVE 회원을 탈퇴합니다.</CardBody>
              <CardFooter>
                <Button
                  colorScheme="facebook"
                  onClick={() => navigate("/main/delete")}
                >
                  회원탈퇴
                </Button>
              </CardFooter>
            </Card>
          </Flex>
        </CardBody>
      </Card>

      {/* 개인정보 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{login.nickName} 님 정보 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            아이디
            <Input type="text" value={login.id} readOnly color="gray" />
            <br />
            닉네임
            <Flex gap={3}>
              <Input
                type="text"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button
                variant="ghost"
                onClick={handleNickNameCheck}
                isDisabled={nickNameChecked}
              >
                중복확인
              </Button>
            </Flex>
            이메일
            <Flex gap={3}>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="ghost"
                onClick={handleEmailCheck}
                isDisabled={emailChecked}
              >
                중복확인
              </Button>
            </Flex>
            비밀번호 <br />
            <Button
              variant="ghost"
              colorScheme="whatsapp"
              onClick={onPasswordModalOpen}
            >
              비밀번호 변경하기
            </Button>
          </ModalBody>
          <ModalFooter gap={5}>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!emailChecked || !nickNameChecked}
            >
              수정
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PasswordRecovery
        isOpen={isPasswordModalOpen}
        onClose={onPasswordModalClose}
      />
    </Center>
  );
}

export default MemberInfo;
