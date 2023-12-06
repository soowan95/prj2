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
  const [favoriteList, setFavoriteList] = useState(null);
  const [index, setIndex] = useState(0);
  const currentListName = useRef("");

  useEffect(() => {
    params.set("id", login.id);
    axios
      .get("/api/myList/favorite?" + params.toString())
      .then((response) => setList(response.data));
  }, [favoriteList]);

  function handleFavoriteList(listId, listName) {
    axios
      .get("/api/myList/favoriteListName?listId=" + listId)
      .then((response) => setFavoriteList(response.data));
    currentListName.current = listName;
    songListModal.onOpen();
  }

  function handleEditFavoriteList(songId, playlistId, listName) {
    axios
      .delete(
        "/api/myList/editFavoriteList?songId=" +
          songId +
          "&playlistId=" +
          playlistId,
      )
      .then(() => {
        toast({
          description: "삭제되었습니다.",
          status: "info",
        });
        songListModal.onClose();
      })
      .catch(() => {
        toast({
          description: "삭제중 문제가 발생하였습니다.",
          status: "warning",
        });
      })
      .finally(() => {
        handleFavoriteList(playlistId, listName);
      });
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
                        src="https://pics.craiyon.com/2023-07-21/5e99d5b0b25c43fb90d62633f33f1a41.webp"
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
                        onClick={() =>
                          handleFavoriteList(song.playlistId, song.listName)
                        }
                      >
                        {song?.listName}
                      </Heading>
                    </CardBody>
                    <Divider color="gray" />
                    <CardFooter>
                      <FontAwesomeIcon icon={faRecordVinyl} />
                      <Text>{song?.songs} 곡</Text>
                      <Spacer />
                      <Text>생성자 : {song?.memberId} 님</Text>
                    </CardFooter>
                  </Card>
                </Box>
              </Box>
            ))}
        </Flex>

        {/*  추천 플레이리스트 모달 */}
        <Modal isOpen={songListModal.isOpen} onClose={songListModal.onClose}>
          <ModalContent>
            <ModalHeader>{currentListName.current}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table>
                <Thead>
                  <Tr>
                    <Th>곡명</Th>
                    <Th>아티스트</Th>
                    <Th>재생</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {favoriteList !== null &&
                    favoriteList.map((l) => (
                      <Tr>
                        <Td>{l.title}</Td>
                        <Td>{l.name}</Td>
                        <Button
                          borderRadius={0}
                          variant="ghost"
                          onClick={() => {
                            setIndex(l.indexForPlay);
                            playDrawer.onOpen();
                          }}
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </Button>
                        <Button
                          borderRadius={0}
                          variant="ghost"
                          onClick={() =>
                            handleEditFavoriteList(
                              l.songId,
                              l.playlistId,
                              l.listName,
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>

        <PlayComp
          isOpen={playDrawer.isOpen}
          onClose={playDrawer.onClose}
          top100={favoriteList}
          index={index}
        />
      </Box>
    </Center>
  );
}

export default MyFavoritePlaylist;
