import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
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
import { LoginContext } from "../../component/LoginProvider";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import PlayComp from "../../component/PlayComp";
import {
  faEllipsis,
  faMinus,
  faOtter,
  faPlay,
  faPlus,
  faQrcode,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddIcon } from "@chakra-ui/icons";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";

function SongInMyFavoritePlaylist() {
  const { login } = useContext(LoginContext);
  const [params] = useSearchParams();
  const [songList, setSongList] = useState(null);
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const listIndex = useRef(0);
  const [list, setList] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const createModal = useDisclosure();
  const addModal = useDisclosure();
  const isSubmit = useRef(true);
  const toast = useToast();
  const navigate = useNavigate();
  const [addPlaylist, setAddPlaylist] = useState([]);
  const [value, setValue] = useState(1);
  const [inputCount, setInputCount] = useState(0);
  const [currentSongId, setCurrnetSongId] = useState(null);

  //플레이리스트 이미지 삽입
  const [imagePreview, setImagePreview] = useState(login.profilePhoto);
  const [coverImage, setCoverImage] = useState("");
  const freader = new FileReader();

  useEffect(() => {
    axios
      .get("/api/myList/getByListId?listId=" + params.get("listId"))
      .then(({ data }) => {
        setList(data);
      });
    axios
      .get("/api/song/chartlist?id=" + params.get("listId"))
      .then(({ data }) => setSongList(data));
  }, []);

  function handleAddModal(songId) {
    const params = new URLSearchParams();
    params.set("id", login.id);
    setCurrnetSongId(songId);
    axios
      .get("/api/myList/get?" + params.toString() + "&songId=" + songId)
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
        songId: currentSongId,
      })
      .then(() => {
        toast({
          description: "저장이 완료되었습니다.",
          status: "success",
        });
        isSubmit.current = true;
        addModal.onClose();
      });
  }

  function handleCreatePlaylist() {
    axios
      .postForm("/api/myList/createPlaylist", {
        listName: playlistName,
        memberId: login.id,
        coverimage: coverImage,
      })
      .then(() => {
        toast({
          description: "생성완료",
          status: "success",
        });
        createModal.onClose();
        window.location.reload(0);
        navigate(() => addModal.onOpen());
      })
      .catch(() => {
        toast({
          description: "생성중 문제가 발생하였습니다.",
          status: "warning",
        });
      });
  }

  function handleCheckPlaylistName() {
    const params = new URLSearchParams();
    params.set("listName", playlistName);
    axios
      .get("/api/myList/check?" + params)
      .then(() => {
        toast({
          description: "이미 사용중인 이름입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "사용 가능한 이름입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <>
      <Box>
        <Flex>
          <Flex flexDirection="row">
            <Box ml={"50px"} mr={"50px"} border="1px solid black">
              <Image
                src={list !== null && list.photo}
                boxSize="350px"
                objectFit="cover" // 이미지가 상자를 완전히 덮도록 크기 조절하는 것
                style={{ margin: "0 auto", display: "block" }}
              />
            </Box>
            <Box>
              <Heading fontSize="30px" color="black">
                {list != null && list.listName}
                <br />
                <br />
              </Heading>
              <Flex>
                <FormLabel style={{ color: "#8d8d8d" }}>제작자</FormLabel>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormLabel> {list != null && list.nickName} 님</FormLabel>
              </Flex>
              <Flex>
                <FormLabel style={{ color: "#8d8d8d" }}>곡수</FormLabel>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormLabel> {list != null && list.totalSongCount}</FormLabel>
              </Flex>
              <Flex>
                <FormLabel style={{ color: "#8d8d8d" }}>조회수</FormLabel>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormLabel> {params.get("count")}회</FormLabel>
              </Flex>
              <Flex>
                <FormLabel style={{ color: "#8d8d8d" }}>작성일</FormLabel>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormLabel> {list != null && list.inserted} </FormLabel>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/*마이플레이리스트 차트*/}
      <Box>
        <Divider />
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>번호</Th>
                <Th></Th>
                <Th>곡정보</Th>
                <Th></Th>
                <Th width={"40px"} p={0}>
                  <Box width={"30px"} ml={"40px"}>
                    재생
                  </Box>
                </Th>
                <Th width={"10px"} p={0}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;정보
                </Th>
                <Th width={"100px"} p={0}>
                  <Box mr={"150px"} width={"40px"}>
                    &nbsp;&nbsp;추가
                  </Box>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {songList === null ? (
                <spinner />
              ) : (
                songList.map((song, idx) => (
                  <Tr>
                    <Td>{idx + 1}</Td>
                    {/*노래 곡 아이디를 보여주는 것이 아닌 1부터 보여주는 것*/}
                    <Td fontWeight={"bold"} fontSize={"20px"}>
                      {song.title}
                    </Td>
                    <Td color={"#8b8b8b"}>{song.artistName}</Td>
                    <Td>{song.album}</Td>
                    <Td p={0}>
                      <Button
                        borderRadius={0}
                        variant="ghost"
                        width={"40px"}
                        ml={"35px"}
                        onClick={() => {
                          setIndex(song.indexForPlay);
                          playModal.onOpen();
                        }}
                      >
                        <FontAwesomeIcon icon={faCirclePlay} />
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        borderRadius={0}
                        variant="ghost"
                        onClick={() => navigate("/main/song/" + song.id)}
                      >
                        <FontAwesomeIcon icon={faQrcode} />
                      </Button>
                    </Td>
                    <Td p={1}>
                      <Button
                        p={0}
                        borderRadius={0}
                        variant="ghost"
                        ml={"-5px"}
                        onClick={() => {
                          listIndex.current = idx;
                          handleAddModal(song.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
        <PlayComp
          isOpen={playModal.isOpen}
          onClose={playModal.onClose}
          songList={songList}
          index={index}
          setIndex={setIndex}
        />
        <Center>
          {/* 플레이리스트 추가 모달 */}
          <Modal isOpen={addModal.isOpen} onClose={addModal.onClose}>
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
                  <Center>
                    <Button onClick={createModal.onOpen}>
                      플레이리스트 만들기
                    </Button>
                  </Center>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="facebook"
                  onClick={() => {
                    handleSavePlaylist();
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

          {/*  플레이리스트 생성 모달  */}
          <Modal isOpen={createModal.isOpen} onClose={createModal.onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>플레이리스트 생성</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex>
                  <Input
                    onChange={(e) => {
                      setInputCount(e.target.value.length);
                      setPlaylistName(e.target.value);
                    }}
                    maxLength="14"
                    placeholder="이름 지정"
                  />
                  <Button variant="ghost" onClick={handleCheckPlaylistName}>
                    중복확인
                  </Button>
                </Flex>
                <Text textAlign="left">{inputCount} / 15</Text>
              </ModalBody>
              <ModalBody>
                <Text>사진 설정</Text>
                <Flex>
                  <Image boxSize="100px" src={imagePreview} />
                  <Input
                    mt={10}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      freader.readAsDataURL(e.target.files[0]);
                      freader.onload = (e) => {
                        setImagePreview(e.target.result);
                      };
                      setCoverImage(e.target.files[0]);
                    }}
                  />
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  colorScheme="facebook"
                  onClick={handleCreatePlaylist}
                >
                  생성
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Center>
      </Box>
    </>
  );
}
export default SongInMyFavoritePlaylist;
