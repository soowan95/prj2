import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
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
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fullHeart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function LikeContainer({ onClick, listId, isLike }) {
  return (
    <>
      <Button mr={1} variant="ghost" size="xl" onClick={() => onClick(listId)}>
        {isLike && <FontAwesomeIcon icon={fullHeart} size="xl" />}
        {isLike || <FontAwesomeIcon icon={faHeart} size="xl" />}
      </Button>
    </>
  );
}

export function MyPlayList() {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [reRend, setReRend] = useState(0);
  const [inputCount, setInputCount] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const count = useRef(0);
  // useRef는 .current 프로퍼티로 전달된 인자로 초기화된 변경 가능한 ref 객체를 반환합니다.

  const { login } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const freader = new FileReader();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios.get("/api/myList/get?" + params).then(({ data }) => setList(data));
  }, [reRend]);

  function handleLike(playListId) {
    axios.post("/api" + "/like", {
      memberId: login.id,
      likelistId: playListId, // handliLike의 파라미터playListId로 받지만 모른다 하지만
      // onClick={handleLike} 밑에 이걸 보면 onClick이 가르키는 것은
      // <Button variant="ghost" size="xl" onClick={() => onClick(listId)}> 즉 onClick(listId) listId 이다
    });
    setReRend((reRend) => reRend + 1);
    // setRerend 가 0에서 클릭할때 1로 바뀌는 것 1에 의미는 없고 변화되는 것에 의미
  }

  function handleChart(listId) {
    axios
      .put("/api/myList/hitscount?id=" + listId, {
        memberId: login.id,
        listId: listId,
      })
      .then(({ data }) => {
        count.current = data;
        window.scrollTo(0, 0);
      })
      .catch(() => console.log("잘 안됨"))
      .finally(() =>
        navigate(
          "/main/chartpage?listId=" + listId + "&count=" + count.current,
          // &count은 &를 사용하여 여러 퀴리 매개변수를 하나의 문자열을 이어 붙일 수 있다
          // 즉 listId와 count의 값을 가지게 된다
        ),
      );
  }

  function handleCheckPlaylistName() {
    const params = new URLSearchParams();
    params.set("listName", playlistName);
    axios
      .get("/api/myList/check?" + params)
      .then(() => {
        toast({
          description: "이미 사용중인 이름입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "사용 가능한 이름입니다.",
            status: "success",
          });
        }
      });
  }

  function handleCreatePlaylist() {
    axios
      .postForm("/api/myList/createPlaylist", {
        listName: playlistName,
        memberId: login.id,
        coverimage: coverImage,
      })
      .then(() => {
        toast({
          description: "생성완료",
          status: "success",
        });
        onClose();
        setReRend((reRend) => reRend + 1);
      })
      .catch(() => {
        toast({
          description: "생성중 문제가 발생하였습니다.",
          status: "warning",
        });
      });
  }

  return (
    <Box>
      <Stack spacing={4}>
        <Flex mt={"50px"}>
          <Heading ml={"338px"} mb={"70px"}>
            {login.nickName} 님의 재생목록
          </Heading>
          <Button onClick={onOpen}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Flex>
        {/*<SimpleGrid columns={3} spacing={5} minChildWidth="70px">*/}
        <Flex flexWrap="wrap" ml={"140px"} justifyContent="center">
          {/* 수정된 부분 */}
          {list !== null &&
            list.map((memberplaylist, index) => (
              <Box mr={"130px"} mb={"20px"}>
                <Card w="xs" bgColor={"none"}>
                  <CardHeader
                    _hover={{ cursor: "pointer" }}
                    onClick={() => handleChart(memberplaylist.listId)}
                  >
                    <Image
                      borderRadius={"20px"}
                      src={memberplaylist.photo}
                      boxSize="220px"
                      objectFit="cover"
                      style={{ margin: "0 auto", display: "block" }}
                    />
                  </CardHeader>
                  <CardBody>
                    <Heading
                      size="md"
                      ml={"40px"}
                      fontSize={"25"}
                      fontWeight={"bold"}
                      _hover={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        handleChart(memberplaylist.listId);
                      }}
                    >
                      {memberplaylist.listName} &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp;
                    </Heading>
                  </CardBody>
                  <CardFooter>
                    <Box ml={"43px"}>{memberplaylist.totalSongCount}곡</Box>
                    <Spacer />
                    <Flex mr={"30px"}>
                      <LikeContainer
                        onClick={handleLike}
                        listId={memberplaylist.listId}
                        isLike={memberplaylist.isLike}
                      ></LikeContainer>
                      <Box>{memberplaylist.countLike}</Box>
                    </Flex>
                  </CardFooter>
                </Card>
              </Box>
            ))}
        </Flex>
        {/*</SimpleGrid>*/}
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>플레이리스트 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Input
                onChange={(e) => {
                  setInputCount(e.target.value.length);
                  setPlaylistName(e.target.value);
                }}
                maxLength="7"
                placeholder="이름 지정"
              />
              <Button variant="ghost" onClick={handleCheckPlaylistName}>
                중복확인
              </Button>
            </Flex>
            <Text textAlign="left">{inputCount} / 8</Text>
          </ModalBody>
          <ModalBody>
            <Text>사진 설정</Text>
            <Flex>
              <Image boxSize="100px" src={imagePreview} />
              <Input
                mt={10}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  freader.readAsDataURL(e.target.files[0]);
                  freader.onload = (e) => {
                    setImagePreview(e.target.result);
                  };
                  setCoverImage(e.target.files[0]);
                }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="facebook"
              onClick={handleCreatePlaylist}
            >
              생성
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
