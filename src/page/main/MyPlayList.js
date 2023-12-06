import React, { useContext, useEffect, useState } from "react";
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
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fullHeart,
  faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function LikeContainer({ onClick, listId }) {
  return (
    <>
      <Button variant="ghost" size="xl" onClick={() => onClick(listId)}>
        <FontAwesomeIcon icon={faHeart} size="xl" />
      </Button>
    </>
  );
}

export function MyPlayList() {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState(null);

  const { login } = useContext(LoginContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios.get("/api/myList/get?" + params).then(({ data }) => setList(data));
  }, [location]);

  function handleLike(playListId) {
    axios
      .post("/api/like", { memberId: login.id, likelistId: playListId }) // 로그인 아이디랑 playlistId 아이디
      .then(() => console.log("잘됨"));
  }

  //   .catch(() => console.log("bad"));

  function handleChart(listId) {
    axios
      .get("/api/myList/favoriteListName?listId=" + listId)
      .then((response) => setMyPlaylist(response.data));
  }

  return (
    <Box mt={50}>
      <Divider />
      <Heading ml={10}>{login.nickName} 님의 재생목록</Heading>
      <Divider />
      <Center mt={50}>
        <Flex gap={5}>
          {list !== null &&
            list.map((song) => (
              <Box gap={5} key={song?.id}>
                <Box mt={30}>
                  <Card w="xs">
                    <CardHeader
                      _hover={{ cursor: "pointer" }}
                      onClick={() => handleChart(song.listId)}
                    >
                      <Image src="https://cdn.dribbble.com/users/5783048/screenshots/13902636/skull_doodle_4x.jpg" />
                    </CardHeader>
                    <CardBody>
                      <Heading
                        size="md"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleChart(song.listId)}
                      >
                        {song?.listName}
                      </Heading>
                    </CardBody>
                    <Divider color="gray" />
                    <CardFooter>
                      {/*<FontAwesomeIcon icon={faRecordVinyl}/>*/}
                      <Text>{song?.songs}곡</Text>
                      <Spacer />
                      <Flex>
                        <LikeContainer
                          onClick={handleLike}
                          listId={song.listId}
                        ></LikeContainer>
                        <Box>{song.countLike}</Box>
                      </Flex>
                    </CardFooter>
                  </Card>
                </Box>
              </Box>
            ))}
        </Flex>
      </Center>
    </Box>
  );
}
