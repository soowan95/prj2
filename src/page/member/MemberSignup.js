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

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sequrityQuestion, setSequrityQuestion] = useState(0);
  const [sequrityAnswer, setSequrityAnswer] = useState("");

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
        sequrityQuestion,
        sequrityAnswer,
      })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        // setIdCheckClicked(true);
        toast({
          description: "이미 사용중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          // setIdCheckClicked(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
  }

  const securityQuestion = [
    "가장 좋아하는 색은 무엇입니까?",
    "가장 좋아하는 영화 제목은 무엇입니까?",
    "처음으로 가보았던 해변의 이름은 무엇입니까?",
    "가장 처음 가본 콘서트는 어떤 가수의 콘서트였습니까?",
  ];

  return (
    <Box>
      <Button onClick={() => setIsModalOpen(true)}>회원 가입</Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                    // setIdCheckClicked(false); // 아이디가 변경되면 중복 확인 버튼이 클릭되지 않은 것으로 초기화
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
                value={securityQuestion}
                onChange={(e) => setSequrityAnswer(parseInt(e.target.value))}
              >
                {sequrityQuestion.map((question, index) => (
                  <option key={index} value={index}>
                    {question}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={!submitAvailable}
              onClick={handelSubmit}
              colorScheme="purple.200"
            >
              가입
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
