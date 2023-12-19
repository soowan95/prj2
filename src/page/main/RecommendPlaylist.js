import React, { useContext, useEffect, useRef, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export function RecommendPlaylist() {
  const { fetchLogin, login } = useContext(LoginContext);
  const [recommendList, setRecommendList] = useState(null);
  const navigate = useNavigate();
  const count = useRef(0);
  const [recommendByViews, setRecommendByViews] = useState(null);

  useEffect(() => {
    fetchLogin();
    axios
      .get("/api/myList/recommendOrderByLike")
      .then((response) => setRecommendList(response.data));
    axios
      .get("/api/myList/recommendOrderByViews")
      .then((response) => setRecommendByViews(response.data));
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
  }

  return (
    <>
      <Box mt={50}>
        <Heading ml={"338px"}>요즘 뜨는 추천 플레이리스트!</Heading>
        <br />
        <br />
        <br />
      </Box>
      <SimpleGrid columns={5} spacing={5} minChildWidth="30px">
        <Flex gap={3} flexWrap="wrap" ml={"90px"} justifyContent="center">
          {/* S3 이미지 출력 */}
          {recommendList !== null &&
            recommendList.map((srl, idx) => (
              <Card
                mr={"100"}
                mb={"20px"}
                width={"250px"}
                height={"350px"}
                bgColor={"none"}
              >
                <Box>
                  <CardHeader height="242px" key={idx}>
                    <Image
                      borderRadius={"20px"}
                      src={srl.picture}
                      alt={srl.cover}
                      _hover={{ cursor: "pointer" }}
                      boxSize="220px"
                      objectFit="cover"
                      style={{ margin: "0 auto", display: "block" }}
                      onClick={() => {
                        handleHitsCount(srl.likelistId);
                      }}
                    />
                  </CardHeader>

                  <CardBody
                    fontSize={"25"}
                    fontWeight={"bold"}
                    ml={"30px"}
                    size="md"
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      handleHitsCount(srl.likelistId);
                    }}
                    pl={1}
                  >
                    {srl.listName}
                  </CardBody>
                  <CardFooter
                    ml={"15px"}
                    mt={"-8px"}
                    pt={0}
                    width={"250px"}
                    height={"20px"}
                  >
                    <Flex gap={10}>
                      <Box>{srl?.songs} 곡</Box>
                      <Box ml={"90px"}>
                        {srl?.count}
                        <FontAwesomeIcon icon={fullHeart} size="lg" />
                      </Box>
                    </Flex>
                  </CardFooter>
                </Box>
              </Card>
            ))}
        </Flex>
      </SimpleGrid>
      <Divider />
      <Box mt={50}>
        <Heading ml={"338px"}>가장 많이 들었던 플레이리스트!!</Heading>
        <br />
        <br />
        <br />
      </Box>
      <SimpleGrid columns={5} spacing={5} minChildWidth="30px">
        <Flex gap={3} flexWrap="wrap" ml={"90px"} justifyContent="center">
          {/* S3 이미지 출력 */}
          {recommendByViews !== null &&
            recommendByViews.map((views, idx) => (
              <Card
                mr={"100"}
                mb={"20px"}
                width={"250px"}
                height={"350px"}
                bgColor={"none"}
              >
                <Box>
                  <CardHeader height="242px" key={idx}>
                    <Image
                      borderRadius={"20px"}
                      src={views.pictureUrl}
                      alt={views.picture}
                      _hover={{ cursor: "pointer" }}
                      boxSize="220px"
                      objectFit="cover"
                      style={{ margin: "0 auto", display: "block" }}
                      onClick={() => {
                        handleHitsCount(views.likelistId);
                      }}
                    />
                  </CardHeader>
                  <CardBody
                    fontSize={"25"}
                    fontWeight={"bold"}
                    ml={"30px"}
                    size="md"
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      handleHitsCount(views.likelistId);
                    }}
                    pl={1}
                  >
                    {views.listName}
                  </CardBody>
                  <CardFooter
                    pt={0}
                    width={"250px"}
                    height={"20px"}
                    ml={"15px"}
                    mt={"-8px"}
                  >
                    <Flex>
                      <Box>{views?.songs} 곡</Box>
                      <Box ml={"65px"}>조회수 : {views?.playlistCount} 회</Box>
                    </Flex>
                  </CardFooter>
                </Box>
              </Card>
            ))}
        </Flex>
      </SimpleGrid>
    </>
  );
}

export default RecommendPlaylist;
