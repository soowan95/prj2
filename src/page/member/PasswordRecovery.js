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
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function PasswordRecovery({ isOpen, onClose, securityQuestions }) {
  const [idForRecovery, setIdForRecovery] = useState("");
  const [selectedSecurityQuestion, setSecurityQuestion] =
    useState("가장 좋아하는 색은 무엇입니까?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();

  const params = new URLSearchParams();

  async function handlePasswordReset() {
    params.set("id", idForRecovery);
    params.set("q", selectedSecurityQuestion);
    params.set("a", securityAnswer);
    params.set("p", newPassword);
    axios
      .put("/api/member/update-password?" + params)
      .then(() => {
        toast({
          title: "변경 완료",
          description: "비밀번호 변경이 성공적으로 완료되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.reload(0);

        // 비밀번호 변경 후 모달 닫음
        setIsModalOpen(false);
      })
      .catch(() => {
        toast({
          title: "오류 발생",
          description: "비밀번호 재설정 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => console.log("done"));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>비밀번호 재설정</ModalHeader>
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
              {securityQuestions.map((question, index) => (
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
          <FormControl mb={5}>
            <FormLabel>새로운 비밀번호</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <Button onClick={handlePasswordReset} colorScheme="purple" mb={4}>
          비밀번호 변경
        </Button>
      </ModalContent>
    </Modal>
  );
}

export default PasswordRecovery;
