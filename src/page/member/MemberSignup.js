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
  // securityQuestionList를 함수 외부에서 선언
  let securityQuestionList = [
    "가장 좋아하는 색은 무엇입니까?",
    "가장 좋아하는 영화 제목은 무엇입니까?",
    "처음으로 가보았던 해변의 이름은 무엇입니까?",
    "가장 처음 가본 콘서트는 어떤 가수의 콘서트였습니까?",
  ];

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        // 가입이 완료되면 모달을 닫음
        setIsModalOpen(false);
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

  function handleForgotPassword() {
    // 사용자에게 입력받은 ID를 서버로 전송하여 보안 질문을 가져옴
    axios
      .get(`/api/member/securityQuestion/${id}`)
      .then((response) => {
        const serverSecurityQuestion = response.data.sequrityQuestion;

        // 사용자에게 보안 질문 물어보고 답변 확인
        const userAnswer = prompt(serverSecurityQuestion);
        if (userAnswer === null) {
          return;
        }

        // 서버로 보안 질문 답변을 전송하여 확인
        axios
          .post("/api/member/forgotPassword", {
            id,
            securityAnswer: userAnswer,
          })
          .then(() => {
            // 비밀번호 재설정 성공
            alert("비밀번호가 성공적으로 재설정되었습니다.");
          })
          .catch(() => {
            // 보안 질문 답변 일치하지 않을 경우
            alert("답변이 올바르지 않습니다.");
          });
      })
      .catch(() => {
        // ID에 해당하는 보안 질문을 찾지 못했을 때
        alert("ID에 해당하는 보안 질문을 찾지 못했습니다.");
      });
  }

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

            <Button onClick={handleForgotPassword}>비밀번호 찾기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
