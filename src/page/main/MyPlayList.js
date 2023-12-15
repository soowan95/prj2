import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fullHeart,
  faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function LikeContainer({ onClick, listId, isLike }) {
  return (
    <>
      <Button variant="ghost" size="xl" onClick={() => onClick(listId)}>
        {isLike && <FontAwesomeIcon icon={fullHeart} size="xl" />}
        {isLike || <FontAwesomeIcon icon={faHeart} size="xl" />}
        {/*<FontAwesomeIcon icon={isLike ? fullHeart : faHeart} />*/}
      </Button>
    </>
  );
}

export function MyPlayList() {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [reRend, setReRend] = useState(0);
  const [songList, setSongList] = useState();
  const [myPlaylist, setMyPlaylist] = useState(null);
  const count = useRef(0);
  // useRef는 .current 프로퍼티로 전달된 인자로 초기화된 변경 가능한 ref 객체를 반환합니다.

  const { login } = useContext(LoginContext);
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios.get("/api/myList/get?" + params).then(({ data }) => setList(data));
  }, [reRend, location]);

  function handleLike(playListId) {
    axios.post("/api" + "/like", {
      memberId: login.id,
      likelistId: playListId, // handliLike의 파라미터playListId로 받지만 모른다 하지만
      // onClick={handleLike} 밑에 이걸 보면 onClick이 가르키는 것은
      // <Button variant="ghost" size="xl" onClick={() => onClick(listId)}> 즉 nClick(listId) listId 이다
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
      .then(({ data }) => (count.current = data))
      .catch(() => console.log("잘 안됨"))
      .finally(() =>
        navigate(
          "/main/chartpage?listId=" + listId + "&count=" + count.current,
          // &count은 &를 사용하여 여러 퀴리 매개변수를 하나의 문자열을 이어 붙일 수 있다
          // 즉 listId와 count의 값을 가지게 된다
        ),
      );
  }

  return (
    <Box>
      <Stack spacing={4}>
        <Divider />
        <Heading ml={5}>{login.nickName} 님의 재생목록</Heading>
        <Divider />
        <Flex flexWrap="wrap" ml={"140px"} justifyContent="center">
          {/* 수정된 부분 */}
          {list !== null &&
            list.map((memberplaylist, index) => (
              <Box>
                <Box mr={"130px"} mb={"20px"}>
                  <Card w="xs">
                    <CardHeader
                      _hover={{ cursor: "pointer" }}
                      onClick={() => handleChart(memberplaylist.listId)}
                    >
                      <Image
                        src={memberplaylist.photo}
                        boxSize="220px"
                        objectFit="cover"
                        style={{ margin: "0 auto", display: "block" }}
                      />
                    </CardHeader>
                    <CardBody>
                      <Heading
                        size="md"
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
                    <Divider color="gray" />
                    <CardFooter>
                      <Box>{memberplaylist.totalSongCount}곡</Box>
                      <Spacer />
                      <Flex>
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
              </Box>
            ))}
        </Flex>
      </Stack>
    </Box>
  );
}
