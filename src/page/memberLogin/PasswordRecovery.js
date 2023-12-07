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

function PasswordRecovery({
  isOpen,
  onClose,
  securityQuestions,
  recoveryInfo,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const toast = useToast();

  const params = new URLSearchParams();

  async function handlePasswordReset() {
    if (!recoveryInfo) {
      return;
    }

    const { id, question, answer } = recoveryInfo;

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "오류 발생",
        description: "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    params.set("id", id);
    params.set("q", question);
    params.set("a", answer);
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
        onClose();
      })
      .catch((error) => {
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
            <Input value={recoveryInfo?.id || ""} isReadOnly />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>보안 질문</FormLabel>
            <Select value={recoveryInfo?.question || ""} isReadOnly>
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
            <Input type="text" value={recoveryInfo?.answer || ""} isReadOnly />
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
        <Button
          w={150}
          onClick={handlePasswordReset}
          colorScheme="purple"
          mb={4}
          ml="auto"
          mr={6}
        >
          비밀번호 변경
        </Button>
      </ModalContent>
    </Modal>
  );
}

export default PasswordRecovery;
