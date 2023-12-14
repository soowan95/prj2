import { CommentContainer } from "../../component/CommentContainer";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
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
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faComputerMouse,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Counter from "./Counter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SongList from "./SongList";
import KakaoShareComp from "../../component/KakaoShareComp";
import { number } from "sockjs-client/lib/utils/random";
import { LoginContext } from "../../component/LoginProvider";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const [albumList, setAlbumList] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const addModal = useDisclosure();
  const createModal = useDisclosure();
  const { login } = useContext(LoginContext);
  const [addPlaylist, setAddPlaylist] = useState([]);
  const [value, setValue] = useState(1);
  const toast = useToast();
  const [inputCount, setInputCount] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  console.log(value);

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => {
      setSongData(data);
      axios
        .get("/api/song/albumList?album=" + data.album)
        .then(({ data }) => setAlbumList(data));
    });
  }, []);

  function handleAddModal() {
    const params = new URLSearchParams();
    params.set("id", login.id);
    axios
      .get("/api/myList/get?" + params.toString())
      .then((response) => setAddPlaylist(response.data));
    addModal.onOpen();
  }

  function handleSavePlaylist() {
    axios
      .postForm("/api/myList/insertMyPlaylist", {
        listId: value,
        id: id,
      })
      .then(() => {
        toast({
          description: "저장이 완료되었습니다.",
          status: "success",
        });
        addModal.onClose();
      })
      .catch(() => {
        toast({
          description: "저장중 문제가 발생하였습니다.",
          status: "warning",
        });
      });
  }

  function handleCreatePlaylist() {
    axios
      .post("/api/myList/createPlaylist", {
        listName: playlistName,
        memberId: login.id,
      })
      .then(() => {
        toast({
          description: "생성완료",
          status: "success",
        });
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
    <Box mt={"100px"}>
      <Center>
        <Flex>
          {/* 가수 이미지 출력 */}
          <Box mr={8}>
            <Image
              src={songData.artistFileUrl}
              alt={`${songData.artistName}-${songData.title}`}
              boxSize="400px"
              objectFit="cover"
            />

            {/* 수정&삭제 버튼은 admin만 보일 수 있게 */}
            <Button
              onClick={() => navigate("/main/songEdit/" + id)}
              background={"aliceblue"}
              size={"xs"}
              mt={"10px"}
            >
              수정
            </Button>
          </Box>

          {/*<Box>{songData.id}</Box>*/}
          <Box>
            <Flex gap={5} alignItems={"center"}>
              <Heading fontSize="30px" color="purple">
                {songData.title}
              </Heading>
              <KakaoShareComp
                title={songData.title}
                description={songData.genre + "&" + songData.mood}
                imageUrl={songData.artistFileUrl}
              />
              <Tooltip label="플레이리스트에 추가" fontSize="0.6rem">
                <Button
                  variant="ghost"
                  borderRadius="full"
                  onClick={handleAddModal}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Tooltip>
            </Flex>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>가수</FormLabel>

                <div>{songData.artistName}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>앨범명</FormLabel>
                <div>{songData.album}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>그룹명</FormLabel>
                <div>{songData.artistGroup}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>장르</FormLabel>
                <div>{songData.genre}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>무드</FormLabel>
                <div>{songData.mood}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>발매일</FormLabel>
                <div>{songData.release}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>가사</FormLabel>
                <div>{songData.lyric}</div>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Center>
      <Center>
        <Box w="1200px">
          <CommentContainer songId={id} />
        </Box>
      </Center>
      <Box>
        {/*<SongList album={album.current} />*/}
        <Center>
          <Box w={"1200px"}>
            <br />
            <Heading size={"md"}>곡 정보</Heading>
            <br />
            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th>번호</Th>
                    <Th>제목</Th>
                    <Th>가수</Th>
                    <Th>앨범명</Th>
                    <Th>출시일</Th>
                    <Th>장르</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {albumList !== null &&
                    albumList.map((album) => (
                      <Tr>
                        <Td>{album.id}</Td>
                        <Td>{album.title}</Td>
                        <Td>{album.name}</Td>
                        <Td>{album.album}</Td>
                        <Td>{album.release}</Td>
                        <Td>{album.genre}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Center>
      </Box>

      {/* 플레이리스트 추가 모달 */}
      <Center>
        <Tooltip label="플레이리스트에 추가" fontSize="0.6rem">
          <Button variant="ghost" borderRadius="full" onClick={addModal.onOpen}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Tooltip>

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
                {addPlaylist.length !== 0 ? (
                  addPlaylist.map((listSongs) => (
                    <Tbody>
                      <Tr>
                        <RadioGroup value={value} onChange={setValue}>
                          <Td>
                            <Radio value={listSongs.listId}>
                              {listSongs.listName}
                            </Radio>
                          </Td>
                        </RadioGroup>
                        <Td>{listSongs.totalSongCount} 곡</Td>
                      </Tr>
                      <Button onClick={createModal.onOpen}>
                        플레이리스트 만들기
                      </Button>
                    </Tbody>
                  ))
                ) : (
                  <Tbody>
                    <Center>
                      <Button onClick={createModal.onOpen}>
                        플레이리스트 만들기
                      </Button>
                    </Center>
                  </Tbody>
                )}
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="facebook" onClick={handleSavePlaylist}>
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
  );
}

export default SongPage;
