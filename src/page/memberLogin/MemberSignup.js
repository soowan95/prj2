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
  FormErrorMessage,
  Flex,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup({ securityQuestionList, isOpen, onClose }) {
  // securityQuestionList를 함수 외부에서 선언

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  const [selectedSecurityQuestion, setSecurityQuestion] = useState(
    securityQuestionList[0],
  );
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [idAvailable, setIdAvailable] = useState(false);

  const toast = useToast();

  let submitAvailable = true;

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (password !== passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  function handelSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        nickName,
        email,
        securityQuestion: selectedSecurityQuestion, // 여기서 selectedSecurityQuestion을 사용
        securityAnswer,
      })
      .then(() => {
        toast({
          title: "가입 완료",
          description: "회원 가입이 성공적으로 완료되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.reload(0);
      })
      .catch(() => {
        toast({
          title: "가입 실패",
          description: "회원 가입 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 가입</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={5} isInvalid={!idAvailable}>
            <FormLabel>아이디</FormLabel>
            <Flex>
              <Input
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              <Button onClick={handleIdCheck}>중복 확인</Button>
            </Flex>
            <FormErrorMessage>아이디 중복체크를 해주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl mb={5} isInvalid={password !== passwordCheck}>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <FormErrorMessage>암호를 확인해주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>닉네임</FormLabel>
            <Input
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>이메일</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>보안 질문</FormLabel>
            <Select
              value={selectedSecurityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
            >
              {securityQuestionList.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!submitAvailable}
            onClick={handelSubmit}
            colorScheme="purple"
          >
            가입
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default MemberSignup;
