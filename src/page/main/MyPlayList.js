import React, { useContext, useEffect, useState } from "react";
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
  list,
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

  const { login } = useContext(LoginContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios.get("/api/myList/get?" + params).then(({ data }) => setList(data));
  }, [reRend, location]);

  // useEffect(() => {
  //   axios
  //     .get("/api/like/board/" + id)
  //     .then((response) => setIsLike(response.data));
  // }, []);

  function handleLike(playListId) {
    axios.post("/api/like", {
      memberId: login.id,
      likelistId: playListId, // handliLike의 파라미터playListId로 받지만 모른다 하지만
      // onClick={handleLike} 밑에 이걸 보면 onClick이 가르키는 것은
      // <Button variant="ghost" size="xl" onClick={() => onClick(listId)}> 즉 nClick(listId) listId 이다
    });
    setReRend((reRend) => reRend + 1);
  }

  function handleChart() {
    axios.get("/api/song/chartlist").then(() => navigate("/main/chartpage"));
  }

  return (
    <Box>
      <Divider />
      <Heading ml={10}>{login.nickName} 님의 재생목록</Heading>
      <Divider />
      <Flex gap={5}>
        {list !== null &&
          list.map(
            (
              memberplaylist, //SELECT a.memberId as id, a.listName, a.id listId FROM memberplaylist a
            ) => (
              //join member b on a.memberId = b.id
              //where b.id = #{id}
              <Box gap={5} key={memberplaylist.id}>
                <Box mt={30}>
                  <Card w="xs">
                    <CardHeader
                      _hover={{ cursor: "pointer" }}
                      onClick={handleChart}
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
                        onClick={handleChart}
                      >
                        {memberplaylist.listName}
                      </Heading>
                    </CardBody>
                    <Divider color="gray" />
                    <CardFooter>
                      {/*<FontAwesomeIcon icon={faRecordVinyl}/>*/}
                      <Text>$곡</Text>
                      <Spacer />
                      <Flex>
                        <LikeContainer
                          onClick={handleLike}
                          listId={memberplaylist.listId} // 리스트 아이디
                          isLike={memberplaylist.isLike} // ture 인지 false 인지 boolean
                        ></LikeContainer>
                        <Box>{memberplaylist.countLike}</Box>
                      </Flex>
                    </CardFooter>
                  </Card>
                </Box>
              </Box>
            ),
          )}
      </Flex>
    </Box>
  );
}
