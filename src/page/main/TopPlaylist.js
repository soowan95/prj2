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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import PlayComp from "../../component/PlayComp";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import { LoginContext } from "../../component/LoginProvider";
// 추천 플레이리스트에서 플레이리스트 클릭시

export function TopPlaylist() {
  const [params] = useSearchParams();
  const [list, setList] = useState(null);
  const [songList, setSongList] = useState(null);
  const [index, setIndex] = useState();
  const playModal = useDisclosure();
  const listIndex = useRef(0);
  const { login } = useContext(LoginContext);

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

  return (
    <>
      <Box>
        <Flex>
          <Flex flexDirection="row">
            <Box mr={8} border="1px solid black">
              <Image
                src={list !== null && list.photo}
                boxSize="400px"
                objectFit="cover" // 이미지가 상자를 완전히 덮도록 크기 조절하는 것
              />
            </Box>
            <Box>
              <Heading fontSize="30px" color="black">
                {list != null && list.listName}
              </Heading>
              <Flex>
                <FormLabel>
                  제작자
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {list != null && list.id}
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>
                  곡수
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {list !== null && list.totalSongCount}곡
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>
                  조회수
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {params.get("count")}회
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>업데이트</FormLabel>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/*마이플레이리스트 차트*/}
      <Box>
        <h1> 게시물 목록 </h1>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>번호</Th>
                <Th></Th>
                <Th>곡정보</Th>
                <Th></Th>
                <Th>재생</Th>
                <Th>정보</Th>
                <Th>추가</Th>
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
                    <Td>{song.title}</Td>
                    <Td>{song.artistName}</Td>
                    <Td>{song.album}</Td>
                    <Td>
                      <Button
                        borderRadius={0}
                        variant="ghost"
                        onClick={() => {
                          setIndex(idx);
                          playModal.onOpen();
                        }}
                      >
                        <FontAwesomeIcon icon={faPlay} />
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        borderRadius={0}
                        variant="ghost"
                        onClick={() => navigate("/main/song/" + song.id)}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        borderRadius={0}
                        variant="ghost"
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
        {songList !== null && (
          <PlayComp
            isOpen={playModal.isOpen}
            onClose={playModal.onClose}
            songList={songList}
            index={index}
            setIndex={setIndex}
          />
        )}
      </Box>
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
    </>
  );
}
export default TopPlaylist;
