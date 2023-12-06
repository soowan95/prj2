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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as fullHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";

function LikeContainer({ onClick, id, like, isAuthenticated, isLike }) {
  if (!like) {
    return null;
  }
  return (
    <Box>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요."}>
        <Button variant="ghost" onClick={() => onClick(id)}>
          <FontAwesomeIcon icon={isLike || like.isLike ? fullHeart : faHeart} />
        </Button>
      </Tooltip>
      {like.countLike}
    </Box>
  );
}

export function Suggestion() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [likeList, setLikeList] = useState([]);
  const [allList, setAllList] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const { isAuthenticated, login } = useContext(LoginContext);

  useEffect(() => {
    if (allList != null) {
      for (const allListElement of allList) {
        axios
          .get("/api/board/" + allListElement.id)

          .then((response) =>
            setLikeList((s) => {
              if (
                s.findIndex((item) => item.boardId === response.data.boardId) <
                0
              ) {
                return [...s, response.data];
              }
              return s;
            }),
          )
          .catch(() => console.log("잘 안됐음"));
      }
    }
  }, [allList]);

  // playList 다 가져오기
  useEffect(() => {
    axios.get("/api/myList/getAll").then(({ data }) => setAllList(data));
  }, [isLogin]);
  // [isLogin] 로그인이 새로 바뀔때마다 다시 islike가 뭔지 getAll 에서 받아 와라

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "info",
        });
        setIsLogin(true);
        navigate("/suggestion");
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 확인해주세요.",
          status: "warning",
        });
      });
  }

  function handleIsLike(listId) {
    axios
      .post("api/like", { memberId: login.id, listId })
      // 로그인 아이디랑 차트 아이디가 데이터
      .then((response) => {
        const data = response.data;
        // 데이터 값을 데이터로 저장해주고
        setLikeList(
          likeList.map((item) => {
            if (data.boardId === item.boardId) {
              return data;
            } else {
              return item;
            }
          }),
        );
      });
    //좋아요 누를때마다 콘솔에 like랑 countlike
  }
  return (
    <>
      <Box position={"relative"} width={"100%"} m={0}>
        {/* 메인 로고 */}
        <Button
          size={"L"}
          mt={"50px"}
          style={{
            position: "relative",
            left: "50%",
            transform: "translate(-50%)",
          }}
          fontSize={"3rem"}
          onClick={() => {
            navigate("/main");

            function setSearchKeyword(s) {}

            // document.getElementById("searchInput").value = "";
            setSearchKeyword("");
          }}
        >
          RELIEVE
        </Button>

        <Popover>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
              top: "-45px",
            }}
          >
            <PopoverTrigger>
              <Button fontSize={"1.7rem"}>
                <FontAwesomeIcon icon={faUser} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                {login.nickName} 님
                <Button size="xs" ml={5}>
                  LOGOUT
                </Button>
              </PopoverHeader>
              <PopoverBody>
                <Button onClick={() => navigate("/myplaylist")} variant="ghost">
                  MyPlayList
                </Button>
              </PopoverBody>
            </PopoverContent>
            <Button
              onChange={() => navigate("/suggestion")}
              variant="ghost"
            ></Button>
          </div>
        </Popover>

        <Flex>
          {allList !== null &&
            allList.map((list) => (
              <Box height={"100%"} width={"30%"}>
                <Card maxW="sm">
                  <CardHeader>
                    <Image
                      src="https://image.genie.co.kr/Y/IMAGE/Playlist/Channel/GENIE/PLAYLIST_20231110120506.png/dims/resize/Q_80,0"
                      alt="Green double couch with wooden legs"
                      borderRadius="lg"
                    />
                  </CardHeader>
                  <CardBody>
                    <Stack mt="6" spacing="3">
                      {/*<Tooltip isDisabled={isAuthenticated} hasArrow label={"로그인 하세요."}></Tooltip>*/}
                      <Heading
                        size="md"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          navigate("/chartpage");
                        }}
                        variant="ghost"
                      >
                        {list.listName}
                      </Heading>
                      {/*</Tooltip>*/}
                      <Text>#카페 #힐링 #설렘</Text>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    <Text color="black" fontSize="">
                      좋아요
                      <LikeContainer
                        like={likeList.find((item) => item.boardId === list.id)}
                        onClick={handleIsLike}
                        id={list.id}
                        isLike={list.isLike}
                        isAuthenticated={isAuthenticated}
                      />
                    </Text>
                  </CardFooter>
                  <CardFooter>
                    <Text>{list.listId}</Text>
                  </CardFooter>
                  <Divider />
                </Card>
              </Box>
            ))}
        </Flex>
        <Box mt={"200px"}>
          <div>
            ID
            <Input value={id} onChange={(e) => setId(e.target.value)}></Input>
          </div>
          <div>
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </div>
          <Button onClick={handleLogin}>login</Button>
        </Box>
      </Box>
    </>
  );
}
