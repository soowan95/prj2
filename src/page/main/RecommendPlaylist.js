import React, { useContext, useEffect, useRef, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormLabel,
  Heading,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Global,
  useDisclosure,
} from "@chakra-ui/react";
import {
  faEllipsis,
  faPlay,
  faRecordVinyl,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlayComp from "../../component/PlayComp";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

export function RecommendPlaylist() {
  const { fetchLogin, login } = useContext(LoginContext);
  const [recommendList, setRecommendList] = useState(null);
  const [params] = useSearchParams();
  const [topPlaylist, setTopPlaylist] = useState(null);
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const listIndex = useRef(0);
  const navigate = useNavigate();
  const count = useRef(0);

  useEffect(() => {
    fetchLogin();
    axios
      .get("/api/myList/recommendOrderByLike")
      .then((response) => setRecommendList(response.data));
  }, []);

  function handleHitsCount(listId) {
    axios
      .put("/api/myList/hitscount?id=" + listId, {
        memberId: login.id,
        listId: listId,
      })
      .then(({ data }) => (count.current = data))
      .catch(() => console.log("잘안됨"))
      .finally(() =>
        navigate(
          "/main/topplaylist?listId=" + listId + "&count=" + count.current,
        ),
      );
    // .then(() => navigate("/main/topplaylist?listId=" + listId));
  }

  return (
    <>
      <Box mt={50}>
        <Heading ml={"338px"}>요즘 뜨는 추천 플레이리스트!</Heading>
        <br />
        <br />
        <br />
      </Box>
      <SimpleGrid columns={3} spacing={5} minChildWidth="70px">
        <Flex gap={5} flexWrap="wrap" ml={"140px"} justifyContent="center">
          {/* S3 이미지 출력 */}
          {recommendList !== null &&
            recommendList.map((srl, idx) => (
              <Card
                mr={"100"}
                mb={"20px"}
                // border="1px solid purple"
                width={"350px"}
                height={"400px"}
                bgColor={"none"}
              >
                <Box>
                  <CardHeader height="242px" key={idx}>
                    <Image
                      src={srl.pictureUrl}
                      alt={srl.picture}
                      _hover={{ cursor: "pointer" }}
                      boxSize="220px"
                      objectFit="cover"
                      style={{ margin: "0 auto", display: "block" }}
                      onClick={() => {
                        handleHitsCount(srl.likelistId);
                      }}
                    />
                  </CardHeader>
                  <Box height="140px" width="220px" ml="64px">
                    <Box pl={1} mt="10px" color="#0096ff">
                      인기 추천
                    </Box>
                    <CardBody
                      fontSize={"25"}
                      fontWeight={"bold"}
                      size="md"
                      _hover={{ cursor: "pointer" }}
                      onClick={() => {
                        handleHitsCount(srl.likelistId);
                      }}
                      pl={1}
                    >
                      {srl.listName}
                    </CardBody>
                    <CardFooter pl={1}>
                      {srl?.songs} 곡
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {srl?.count}
                      <FontAwesomeIcon icon={fullHeart} size="xl2" />
                    </CardFooter>
                  </Box>
                </Box>
              </Card>
            ))}
        </Flex>
      </SimpleGrid>
    </>
  );
}

export default RecommendPlaylist;
