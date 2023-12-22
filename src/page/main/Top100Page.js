import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Table,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { SongContext } from "../../layout/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faClone } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PlayComp from "../../component/PlayComp";
import { LoginContext } from "../../component/LoginProvider";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export function Top100Page() {
  const [similar, setSimilar] = useState(null);
  const [songIndex, setSongIndex] = useState(0);
  const [addPlaylist, setAddPlaylist] = useState([]);
  const [value, setValue] = useState(0);
  const [id, setId] = useState(null);

  const { login } = useContext(LoginContext);
  const { top100 } = useContext(SongContext);

  const thisId = useRef(0);
  const isSubmit = useRef(true);

  const songDrawer = useDisclosure();
  const addModal = useDisclosure();

  const params = new URLSearchParams();

  const navigate = useNavigate();

  const toast = useToast();

  function handleSimilarButton(genre, mood, id) {
    params.set("genre", genre);
    params.set("mood", mood);
    params.set("id", id);

    if (thisId.current === id) {
      thisId.current = 0;
      setSimilar(null);
    } else {
      thisId.current = id;

      axios.get("/api/song/similar?" + params).then(({ data }) => {
        setSimilar(data);
      });
    }
  }

  function handleGoToSong(id) {
    navigate(`/main/song/${id}`);
  }

  function handleAddModal(id) {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios
      .get("/api/myList/get?" + params.toString() + "&songId=" + id)
      .then((response) => {
        setAddPlaylist(response.data);
        if (response.data.filter((a) => a.isSongContain === false).length !== 0)
          isSubmit.current = false;
      });
    addModal.onOpen();
  }

  function handleSavePlaylist() {
    axios
      .post("/api/myList/insertMyPlaylist", {
        listId: value,
        songId: id,
      })
      .then(() => {
        toast({
          description: "저장이 완료되었습니다.",
          status: "success",
        });
        axios
          .get("/api/myList/get?id=" + login.id + "&songId=" + id)
          .then((response) => {
            setAddPlaylist(response.data);
            isSubmit.current =
              response.data.filter((a) => a.isSongContain === false).length ===
              0;
          });
        addModal.onClose();
      });
  }

  return (
    <Box mt={"100px"}>
      {top100 !== null &&
        top100.map((song) => (
          <Box
            key={song.id}
            m={"10px auto"}
            width={"75%"}
            alignItems={"center"}
            borderBottom={"1px solid lavender"}
          >
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              _hover={{ bg: "rgba(129,133,136,0.38)" }}
            >
              <Box
                onClick={() => {
                  setSongIndex(song.indexForPlay);
                  songDrawer.onOpen();
                }}
                w={"20%"}
                h={"60px"}
              >
                <FormControl w={"300px"}>
                  <FormLabel fontSize={17} color={"#F3DA2A"} cursor={"pointer"}>
                    <FontAwesomeIcon icon={faCirclePlay} /> {song.title}
                  </FormLabel>
                  <FormLabel fontSize={15} cursor={"pointer"}>
                    {song.artistName}
                  </FormLabel>
                </FormControl>
              </Box>

              {/*<Box w={"20%"}>{song.artistName}</Box>*/}

              <Box w={"20%"}>{song.genre}</Box>
              <Box w={"20%"}>{song.mood}</Box>
              <Box
                w={"15%"}
                textAlign={"right"}
                onClick={() =>
                  handleSimilarButton(song.genre, song.mood, song.id)
                }
              >
                <Tooltip label={"Similar Songs"}>
                  <FontAwesomeIcon
                    cursor={"pointer"}
                    fontSize={"0.8rem"}
                    icon={faClone}
                  />
                </Tooltip>
              </Box>
              <Box
                w={"3%"}
                textAlign={"right"}
                onClick={() => {
                  handleAddModal(song.id);
                  setId(song.id);
                }}
              >
                <Tooltip label="플레이리스트에 추가">
                  <FontAwesomeIcon
                    cursor={"pointer"}
                    fontSize={"0.8rem"}
                    icon={faPlus}
                  />
                </Tooltip>
              </Box>
            </Flex>
            <Center>
              <Flex w={"80%"} justifyContent={"space-between"}>
                {similar !== null &&
                  song.id === thisId.current &&
                  similar.map((si) => (
                    <Box key={si.id} m={"0 auto"}>
                      <Card
                        w={"180px"}
                        bg={
                          localStorage.getItem("chakra-ui-color-mode") ===
                          "dark"
                            ? "#f3cd5d"
                            : "#e86db3"
                        }
                      >
                        <CardBody>
                          {si.title.length <= 10 ? (
                            <Flex justifyContent={"space-between"}>
                              <Box
                                fontWeight={"bold"}
                                color={"#535353"}
                                cursor={"pointer"}
                                onClick={() => handleGoToSong(si.id)}
                              >
                                {si.title}
                              </Box>

                              <Box
                                cursor={"pointer"}
                                onClick={() => {
                                  handleAddModal(si.id);
                                  setId(si.id);
                                }}
                              >
                                <Tooltip label="플레이리스트에 추가">
                                  <FontAwesomeIcon icon={faPlus} />
                                </Tooltip>
                              </Box>
                            </Flex>
                          ) : (
                            <Flex justifyContent={"space-between"}>
                              <Box
                                fontWeight={"bold"}
                                color={"#535353"}
                                cursor={"pointer"}
                                onClick={() => handleGoToSong(si.id)}
                              >
                                <Tooltip label={si.title} placement="top-start">
                                  {si.title.slice(0, 10) + ".."}
                                </Tooltip>
                              </Box>
                              <Box
                                cursor={"pointer"}
                                onClick={() => {
                                  handleAddModal(si.id);
                                  setId(si.id);
                                }}
                              >
                                <Tooltip label="플레이리스트에 추가">
                                  <FontAwesomeIcon icon={faPlus} />
                                </Tooltip>
                              </Box>
                            </Flex>
                          )}
                          {si.artistName.length <= 10 ? (
                            <Box>{si.artistName}</Box>
                          ) : (
                            <Box>
                              <Tooltip
                                label={si.artistName}
                                placement="top-start"
                              >
                                {si.artistName.slice(0, 10) + ".."}
                              </Tooltip>
                            </Box>
                          )}
                          {si.genre.length <= 10 ? (
                            <Box>{si.genre}</Box>
                          ) : (
                            <Box>
                              <Tooltip label={si.genre} placement="top-start">
                                {si.genre.slice(0, 10) + ".."}
                              </Tooltip>
                            </Box>
                          )}
                          {si.mood.length <= 10 ? (
                            <Box>{si.mood}</Box>
                          ) : (
                            <Box>
                              <Tooltip label={si.mood} placement="top-start">
                                {si.mood.slice(0, 10) + ".."}
                              </Tooltip>
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    </Box>
                  ))}
              </Flex>
            </Center>
          </Box>
        ))}
      {top100 !== null && top100.length !== 0 && (
        <PlayComp
          index={songIndex}
          setIndex={setSongIndex}
          isOpen={songDrawer.isOpen}
          onClose={songDrawer.onClose}
          songList={top100}
        />
      )}
      {/* 플레이리스트 추가 모달 */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={() => {
          addModal.onClose();
          setValue(0);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>플레이리스트 선택</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Table>
              <Thead>
                <Tr>
                  <Th>플레이리스트</Th>
                  <Th>곡 수</Th>
                </Tr>
              </Thead>
              {addPlaylist.length !== 0 &&
                addPlaylist.map((listSongs) => (
                  <Tr>
                    <RadioGroup value={value} onChange={setValue}>
                      <Td>
                        <Radio
                          value={listSongs.listId}
                          isDisabled={listSongs.isSongContain}
                        >
                          {listSongs.listName}
                        </Radio>
                      </Td>
                    </RadioGroup>
                    <Td>{listSongs.totalSongCount} 곡</Td>
                  </Tr>
                ))}
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="facebook"
              onClick={() => {
                handleSavePlaylist();
                setValue(0);
              }}
              isDisabled={isSubmit.current}
            >
              저장
            </Button>
            <Button colorScheme="red" onClick={addModal.onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
