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
  Divider,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import ItemsCarousel from "react-items-carousel";

export function RecommendPlaylist() {
  const { fetchLogin, login } = useContext(LoginContext);
  const navigate = useNavigate();
  const count = useRef(0);
  const [recommendByViews, setRecommendByViews] = useState(null);
  const [currentUpperIndex, setCurrentUpperIndex] = useState(0);
  const [currentLowerIndex, setCurrentLowerIndex] = useState(0);
  const [recommendList, setRecommendList] = useState(null);

  useEffect(() => {
    fetchLogin();
    axios
      .get("/api/myList/recommendOrderByLike")
      .then(({ data }) => setRecommendList(data));
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
        <Heading ml={"338px"} mb={"70px"}>
          요즘 뜨는 추천 플레이리스트!
        </Heading>
      </Box>
      <Box w={"1500px"} m={"0 auto"} alignItems={"center"}>
        <ItemsCarousel
          chevronWidth={10}
          numberOfCards={5}
          slidesToScroll={5}
          gutter={0}
          outsideChevron={false}
          activeItemIndex={currentUpperIndex}
          requestToChangeActive={setCurrentUpperIndex}
          rightChevron={
            <Button>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          }
          firstAndLastGutter={true}
          leftChevron={
            <Button>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          }
        >
          {recommendList !== null &&
            recommendList.map((srl, idx) => (
              <Card
                key={idx}
                mb={"20px"}
                mx={"25px"}
                width={"250px"}
                height={"350px"}
                bgColor={"none"}
              >
                <Box>
                  <CardHeader height="242px">
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
                    <Flex>
                      <Box>{srl?.songs} 곡</Box>
                      <Box ml={"65px"}>좋아요 : {srl?.count} 개</Box>
                    </Flex>
                  </CardFooter>
                </Box>
              </Card>
            ))}
        </ItemsCarousel>
      </Box>
      <Divider />
      <Box mt={50}>
        <Heading ml={"338px"} mb={"70px"}>
          가장 많이 들었던 플레이리스트!!
        </Heading>
      </Box>
      <Box w={"1500px"} m={"0 auto"} alignItems={"center"}>
        <ItemsCarousel
          chevronWidth={10}
          numberOfCards={5}
          slidesToScroll={5}
          gutter={0}
          outsideChevron={false}
          activeItemIndex={currentLowerIndex}
          requestToChangeActive={setCurrentLowerIndex}
          rightChevron={
            <Button>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          }
          firstAndLastGutter={true}
          leftChevron={
            <Button>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          }
        >
          {recommendByViews !== null &&
            recommendByViews.map((views, idx) => (
              <Card
                mx={"25px"}
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
        </ItemsCarousel>
      </Box>
    </>
  );
}

export default RecommendPlaylist;
