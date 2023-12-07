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
import PasswordRecovery from "./PasswordRecovery";

function FoundPassword({ isOpen, onClose, securityQuestions }) {
  const [idForRecovery, setIdForRecovery] = useState("");
  const [selectedSecurityQuestion, setSecurityQuestion] =
    useState("가장 좋아하는 색은 무엇입니까?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isConfirmPasswordClicked, setIsConfirmPasswordClicked] =
    useState(false);
  const [fetchedPassword, setFetchedPassword] = useState(""); // 추가: 가져온 비밀번호 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 이 state 변수도 있다고 가정합니다.
  const [recoveryInfo, setRecoveryInfo] = useState(null);

  const toast = useToast();

  const params = new URLSearchParams();

  // Reset 함수(창 닫으면 입력했던 값 남아있지 않게)
  const resetForm = () => {
    setIdForRecovery("");
    setSecurityQuestion("가장 좋아하는 색은 무엇입니까?");
    setSecurityAnswer("");
  };

  async function handleConfirmPassword() {
    params.set("id", idForRecovery);
    params.set("q", selectedSecurityQuestion);
    params.set("a", securityAnswer);

    try {
      const response = await axios.post("/api/member/get-password", params);

      const originalPassword = response.data;

      // 기존 비밀번호를 새로운 모달창에 앞의 절반만 보여줌
      setFetchedPassword(originalPassword);
      // 비밀번호 확인 시 받아온 정보 저장(id, 질문, 답)
      setRecoveryInfo({
        id: idForRecovery,
        question: selectedSecurityQuestion,
        answer: securityAnswer,
      });
      setIsModalOpen(true);
      resetForm();

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

  function handleClose() {
    setIsModalOpen(false);
    onClose();
    resetForm();
  }

  function navigateToMemberInfo() {
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>비밀번호 찾기</ModalHeader>
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
          <Flex justifyContent="flex-end" mr={6}>
            <Button onClick={handleConfirmPassword} colorScheme="purple" mb={4}>
              찾기
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

      {/* 비밀번호 재설정(PasswordRecovery) 호출 부분 */}
      {isConfirmPasswordClicked && (
        <PasswordRecovery
          isOpen={true}
          onClose={() => setIsConfirmPasswordClicked(false)}
          securityQuestions={securityQuestions}
          recoveryInfo={recoveryInfo}
        />
      )}

      {/* 기존 비밀번호를 알려주는 새로운 모달창 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>비밀번호 표시</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p style={{ marginBottom: "15px" }}>
              비밀번호는 : {fetchedPassword}
            </p>
            {/* 처음 로그인 창인 MemberInfo로 돌아가는 버튼 추가 */}
            <Flex justifyContent="center">
              <Button w={150} onClick={navigateToMemberInfo} mr={3}>
                로그인으로
              </Button>
              {/* 비밀번호 재설정 버튼 */}
              <Button
                w={150}
                onClick={() => {
                  setIsConfirmPasswordClicked(true);
                  setNewPassword(""); // 새로운 비밀번호 입력 초기화
                  setConfirmNewPassword(""); // 확인 비밀번호 입력 초기화
                }}
              >
                비밀번호 변경
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FoundPassword;
