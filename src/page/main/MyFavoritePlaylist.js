import React, { useContext, useEffect, useRef, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlay,
  faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PlayComp from "../../component/PlayComp";

export function MyFavoritePlaylist() {
  const { login } = useContext(LoginContext);
  const songListModal = useDisclosure();
  const playDrawer = useDisclosure();
  const toast = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [index, setIndex] = useState(0);
  const [favoriteList, setFavoriteList] = useState(null);

  useEffect(() => {
    params.set("id", login.id);
    axios
      .get("/api/myList/favorite?" + params.toString())
      .then((response) => setList(response.data));
  }, [favoriteList]);

  function handleFavoriteList(listId) {
    navigate("/main/songinmyfavoriteplaylist?listId=" + listId);
  }

  return (
    <Center mt={50}>
      <Box mt={30}>
        <Heading>{login.nickName} 님의 취향저격 플레이리스트</Heading>
        <Divider />
        <Flex gap={5}>
          {list !== null &&
            list.map((song) => (
              <Box gap={5} key={song?.id}>
                <Box mt={30}>
                  <Card w="xs">
                    <CardHeader _hover={{ cursor: "pointer" }}>
                      <Image
                        onClick={() => handleFavoriteList(song.playlistId)}
                      />
                    </CardHeader>
                    <CardBody>
                      <Heading
                        size="md"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleFavoriteList(song.playlistId)}
                      >
                        {song?.listName}
                      </Heading>
                    </CardBody>
                    <Divider color="gray" />
                    <CardFooter>
                      <FontAwesomeIcon icon={faRecordVinyl} />
                      <Text>{song?.songs} SONGS</Text>
                      <Spacer />
                      <Text>ID : {song?.memberId} </Text>
                    </CardFooter>
                  </Card>
                </Box>
              </Box>
            ))}
        </Flex>
      </Box>
    </Center>
  );
}

export default MyFavoritePlaylist;
