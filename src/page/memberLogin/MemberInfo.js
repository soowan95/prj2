import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
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
  const [questions, setQuestions] = useState(null);
  const [imagePreview, setImagePreview] = useState(login.profilePhoto);
  const [profilePhoto, setProfilePhoto] = useState("");

  const [isNickNameOk, setIsNickNameOk] = useState(false);
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [inputPicture, setInputPicture] = useState("none");

  const freader = new FileReader();

  useEffect(() => {
    axios.get("/api/member" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
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
        setIsNickNameOk(true);
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용중인 이메일입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 이메일입니다.",
            status: "success",
          });
        }
        setIsEmailOk(true);
      });
  }

  function handleSubmit() {
    if (profilePhoto) {
      axios
        .putForm("/api/member/edit", {
          id: login.id,
          email: isEmailOk ? email : null,
          nickName: isNickNameOk ? nickName : null,
          photo: profilePhoto,
        })
        .then(() => {
          toast({
            description: "수정되었습니다",
            status: "success",
          });
          onClose();
          fetchLogin();
          window.location.reload(0);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .put("/api/member/editOnlyInfo", {
          id: login.id,
          email: isEmailOk ? email : null,
          nickName: isNickNameOk ? nickName : null,
        })
        .then(() => {
          toast({
            description: "수정되었습니다",
            status: "success",
          });
          onClose();
          fetchLogin();
          window.location.reload(0);
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <Center mt={50}>
      <Card bg="transparent" mt={50} w="2xl" h="2xl">
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
              <CardBody mt={50}>정보 요청 현황을 확인합니다.</CardBody>
              <CardFooter>
                <Button
                  colorScheme="facebook"
                  onClick={() => navigate("/main/mySongRequestList")}
                >
                  요청 확인
                </Button>
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
            <FormControl>
              <FormLabel>아이디</FormLabel>
              <Input type="text" value={login.id} readOnly color="gray" />
            </FormControl>
            <FormControl isInvalid={!nickNameAvailable} mb={5}>
              <FormLabel>닉네임</FormLabel>
              <Flex gap={3}>
                <Input
                  type="text"
                  placeholder={login.nickName}
                  value={nickName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    setNickNameAvailable(false);
                  }}
                  onKeyUp={(e) => {
                    if (e.target.value.startsWith("k-"))
                      e.target.value = e.target.value.replace("k-", "");
                  }}
                />
                <Button
                  isDisabled={login.nickName === nickName || !nickName}
                  variant="ghost"
                  onClick={handleNickNameCheck}
                >
                  중복확인
                </Button>
              </Flex>
              <FormHelperText textAlign={"center"}>
                k- 로 시작할 수 없습니다.
              </FormHelperText>
            </FormControl>
            <FormControl inInvalid={!emailAvailable}>
              <FormLabel>이메일</FormLabel>
              <Flex gap={3}>
                <Input
                  type="text"
                  placeHolder={login.email}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(false);
                  }}
                />
                <Button
                  isDisabled={login.email === email || !email}
                  variant="ghost"
                  onClick={handleEmailCheck}
                >
                  중복확인
                </Button>
              </Flex>
              <FormHelperText textAlign={"center"}>
                중복확인 안하면 기존 정보가 사용됩니다.
              </FormHelperText>
            </FormControl>
            <RadioGroup mt={3} value={inputPicture} onChange={setInputPicture}>
              <Box>사진을 첨부하시겠습니까?</Box>
              <Stack direction="row">
                <Radio value="block">네</Radio>
                <Radio value="none">아니오</Radio>
              </Stack>
            </RadioGroup>
            <Box display={inputPicture}>
              <FormControl>
                <FormLabel>프로필 사진 변경</FormLabel>
                <Flex>
                  <Image
                    borderRadius="full"
                    boxSize="100px"
                    src={imagePreview}
                  />
                  <Input
                    mt={10}
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
                </Flex>
              </FormControl>
            </Box>
            <FormControl mt={3}>
              <FormLabel>비밀번호</FormLabel>
              <Button
                variant="ghost"
                colorScheme="whatsapp"
                onClick={onPasswordModalOpen}
              >
                비밀번호 변경하기
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={5}>
            <Button
              isDisabled={
                !(
                  (login.nickName !== nickName && isNickNameOk) ||
                  (login.email !== email && isEmailOk) ||
                  profilePhoto
                )
              }
              colorScheme="blue"
              onClick={handleSubmit}
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
        recoveryInfo={login}
        isOpen={isPasswordModalOpen}
        onClose={onPasswordModalClose}
      />
    </Center>
  );
}

export default MemberInfo;
