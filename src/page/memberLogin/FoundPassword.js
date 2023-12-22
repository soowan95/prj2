import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import PasswordRecovery from "./PasswordRecovery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

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
  const [nickName, setNickName] = useState(""); // 가져온 닉네임
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

      // 서버 응답에서 fetchedPassword와 nickName이라는 키의 값을 가져오고
      // 서버에서의 응답은 response.data에 담겨있음
      const { fetchedPassword, nickName } = response.data;
      // setFetchedPassword와 setNickName은 useState 훅을 통해 정의된 상태 변수를 업데이트하는 함수
      setFetchedPassword(fetchedPassword);
      setNickName(nickName);

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
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ marginTop: "50px" }}>
            <Box
              style={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  marginBottom: "35px",
                }}
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ fontSize: "35px", color: "limegreen" }}
                />
              </p>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                <span style={{ color: "#9851da" }}>{nickName}</span>님의
                비밀번호는
                <br />
                <span style={{ color: "#9851da" }}>{fetchedPassword}</span>{" "}
                입니다.
              </p>
            </Box>
            <Box
              style={{
                textAlign: "center",
                marginTop: "35px",
                marginBottom: "50px",
                backgroundColor: "#3b1d54",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              <FontAwesomeIcon icon={faCircleExclamation} /> 정보 보호를 위해
              비밀번호의 일부만 보여집니다.
              <br />
            </Box>
            {/* 처음 로그인 창인 MemberInfo로 돌아가는 버튼 추가 */}
            <Flex justifyContent="center">
              <Button
                w={150}
                onClick={navigateToMemberInfo}
                mr={3}
                style={{ marginBottom: "20px" }}
              >
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
