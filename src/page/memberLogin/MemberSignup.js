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
  FormHelperText,
  Image,
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
  const [emailOk, setEmailOk] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const [selectedSecurityQuestion, setSecurityQuestion] = useState(
    securityQuestionList[0],
  );
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [idAvailable, setIdAvailable] = useState(false);

  const toast = useToast();

  let submitAvailable = true;

  const freader = new FileReader();

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
      .postForm("/api/member/signup", {
        id,
        password,
        nickName,
        email,
        securityQuestion: selectedSecurityQuestion, // 여기서 selectedSecurityQuestion을 사용
        securityAnswer,
        profilePhoto,
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

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);
    axios
      .get("api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용중인 닉네임입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임입니다.",
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
              <Button onClick={handleIdCheck} variant="ghost">
                중복 확인
              </Button>
            </Flex>
            <FormErrorMessage>아이디 중복체크를 해주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onKeyUp={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z!@#0-9]/g, "");
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormHelperText>
              특수기호는 !,@,# 만 사용 가능합니다.
            </FormHelperText>
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
            <Flex>
              <Input
                type="text"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button onClick={handleNickNameCheck} variant="ghost">
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>닉네임 중복체크를 해주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>이메일</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                if (
                  email.match(
                    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
                  )
                )
                  setEmailOk(true);
                else setEmailOk(false);
                setEmail(e.target.value);
              }}
            />
            {emailOk || (
              <FormHelperText color={"red"}>
                이메일 양식을 확인해주세요.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>프로필 사진</FormLabel>
            <FormHelperText>3MB이내 이미지파일만 가능합니다.</FormHelperText>
            <Image borderRadius="full" boxSize="150px" src={imagePreview} />
          </FormControl>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              freader.readAsDataURL(e.target.files[0]);
              freader.onload = (e) => {
                setImagePreview(e.target.result);
              };
              setProfilePhoto(e.target.files[0]);
            }}
          />
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
            isDisabled={submitAvailable && !emailOk}
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
