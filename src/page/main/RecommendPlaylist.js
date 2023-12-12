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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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

export function RecommendPlaylist() {
  const { fetchLogin, login } = useContext(LoginContext);
  const [recommendList, setRecommendList] = useState(null);
  const [params] = useSearchParams();
  const [topPlaylist, setTopPlaylist] = useState(null);
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const listIndex = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogin();
    axios
      .get("/api/myList/recommendOrderByLike")
      .then((response) => setRecommendList(response.data));
  }, []);

  function handleHitsCount(listId) {
    axios
      .put("/api/myList/hitscount?id=" + listId)
      .then(() => navigate("/main/topplaylist?listId=" + listId));
  }

  return (
    <>
      <Box mt={50}>
        <Heading>요즘 뜨는 추천 플레이리스트!</Heading>
      </Box>
      <Flex gap={5}>
        {/* S3 이미지 출력 */}
        {recommendList !== null &&
          recommendList.map((srl, idx) => (
            <Card w="sm" border="1px solid purple">
              <CardHeader key={idx}>
                <Image
                  src={srl.pictureUrl}
                  alt={srl.picture}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    handleHitsCount(srl.likelistId);
                  }}
                />
              </CardHeader>
              <CardBody
                _hover={{ cursor: "pointer" }}
                onClick={() => {
                  handleHitsCount(srl.likelistId);
                }}
              >
                {srl.listName}
              </CardBody>
              <CardFooter>
                <FontAwesomeIcon icon={faRecordVinyl} />
                {srl?.songs} SONGS
              </CardFooter>
              <CardFooter>
                <FontAwesomeIcon icon={faHeart} />
                {srl?.count} LIKES
              </CardFooter>
            </Card>
          ))}
      </Flex>
    </>
  );
}

export default RecommendPlaylist;
