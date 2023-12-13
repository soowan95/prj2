import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  FormLabel,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PlayComp from "../../component/PlayComp";
import {
  faEllipsis,
  faMinus,
  faPlay,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SongInMyFavoritePlaylist() {
  const { login } = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [favoriteList, setFavoriteList] = useState(null);
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const editModal = useDisclosure();
  const listIndex = useRef(0);

  useEffect(() => {
    axios
      .get("/api/myList/favoriteListName?" + params)
      .then((response) => setFavoriteList(response.data));
  }, []);

  function handleEditFavoriteList(songId, playlistId) {
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
        window.location.reload(0);
      })
      .catch(() => {
        toast({
          description: "삭제중 문제가 발생하였습니다.",
          status: "warning",
        });
      });
  }

  return (
    <Center mt={50}>
      <Box>
        <Flex flexDirection="row">
          <Box mr={8}>
            <Image
              src="https://image.genie.co.kr/Y/IMAGE/Playlist/Channel/GENIE/PLAYLIST_20231128121036.png/dims/resize/Q_80,0"
              boxSize="400px"
              objectFit="cover" // 이미지가 상자를 완전히 덮도록 크기 조절하는 것
            />
          </Box>
          <Box>
            <Heading fontSize="30px" color="black"></Heading>
            <Flex>
              <FormLabel>제작자</FormLabel>
            </Flex>
            <Flex>
              <FormLabel>조회수</FormLabel>
            </Flex>
          </Box>
        </Flex>
        <Card mt={50}>
          <Box>
            <Table mt={50}>
              <Thead>
                <Tr>
                  <Th>번호</Th>
                  <Th>제목</Th>
                  <Th>아티스트</Th>
                  <Th>재생</Th>
                  <Th>정보</Th>
                  <Th>삭제</Th>
                </Tr>
              </Thead>
              <Tbody>
                {favoriteList !== null &&
                  favoriteList.map((listSong, idx) => (
                    <Tr>
                      <Td>{listSong.indexForPlay + 1}</Td>
                      <Td>{listSong.title}</Td>
                      <Td>{listSong.artistName}</Td>
                      <Td>
                        <Button
                          borderRadius={0}
                          variant="ghost"
                          onClick={() => {
                            setIndex(listSong.indexForPlay);
                            playModal.onOpen();
                          }}
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </Button>
                      </Td>
                      <Td>
                        <Button borderRadius={0} variant="ghost">
                          <Popover>
                            <PopoverTrigger>
                              <FontAwesomeIcon icon={faEllipsis} />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>곡 정보</PopoverHeader>
                              <PopoverBody textAlign="left">
                                제목 : {listSong.title} <br />
                                아티스트 : {listSong.artistName} <br />
                                앨범 : {listSong.album} <br />
                                발매일 : {listSong.release} <br />
                                장르 : {listSong.genre}
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          borderRadius={0}
                          variant="ghost"
                          onClick={() => {
                            listIndex.current = idx;
                            editModal.onOpen();
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
          <PlayComp
            isOpen={playModal.isOpen}
            onClose={playModal.onClose}
            songList={favoriteList}
            index={index}
            setIndex={setIndex}
          />
        </Card>

        {/*  곡 삭제 모달  */}
        <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
          <ModalContent>
            <ModalHeader>곡 삭제</ModalHeader>
            <ModalCloseButton />
            <ModalBody>선택하신 곡을 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                onClick={() =>
                  handleEditFavoriteList(
                    favoriteList.at(listIndex).id,
                    params.get("listId"),
                  )
                }
              >
                삭제
              </Button>
              <Button onClick={editModal.onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
}

export default SongInMyFavoritePlaylist;
