import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function FoundPassword({ isOpen, onClose, securityQuestions }) {
  const [idForRecovery, setIdForRecovery] = useState("");
  const [selectedSecurityQuestion, setSecurityQuestion] =
    useState("가장 좋아하는 색은 무엇입니까?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isConfirmPasswordClicked, setIsConfirmPasswordClicked] =
    useState(false);
  const [maskedPassword, setMaskedPassword] = useState(""); // 추가: 마스킹된 비밀번호 상태
  const [fetchedPassword, setFetchedPassword] = useState(""); // 추가: 가져온 비밀번호 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 이 state 변수도 있다고 가정합니다.

  const toast = useToast();

  const params = new URLSearchParams();

  async function handleConfirmPassword() {
    params.set("id", idForRecovery);
    params.set("q", selectedSecurityQuestion);
    params.set("a", securityAnswer);

    try {
      const response = await axios.post("/api/member/get-password", params);

      const originalPassword = response.data;

      // 기존 비밀번호를 새로운 모달창에 절반만 보여줌
      setFetchedPassword(originalPassword);
      setIsModalOpen(true);

      toast({
        title: "확인 완료",
        description: "비밀번호가 확인되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);

      toast({
        title: "오류 발생",
        description: "입력 값을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>비밀번호 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={5}>
              <FormLabel>아이디</FormLabel>
              <Input
                value={idForRecovery}
                onChange={(e) => setIdForRecovery(e.target.value)}
              />
            </FormControl>
            <FormControl mb={5}>
              <FormLabel>보안 질문</FormLabel>
              <Select
                value={selectedSecurityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              >
                {securityQuestions &&
                  securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl mb={5}>
              <FormLabel>답변</FormLabel>
              <Input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <Flex>
            <Button onClick={handleConfirmPassword}>비밀번호 확인</Button>
          </Flex>
        </ModalContent>
      </Modal>

      {/* 기존 비밀번호를 알려주는 새로운 모달창 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>비밀번호 표시</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>비밀번호는: {fetchedPassword}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FoundPassword;
