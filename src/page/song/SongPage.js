import { CommentContainer } from "../../component/CommentContainer";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
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
  faChevronDown,
  faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import KakaoShareComp from "../../component/KakaoShareComp";
import { LoginContext } from "../../component/LoginProvider";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import PlayComp from "../../component/PlayComp";
import { useImmer } from "use-immer";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const [albumList, setAlbumList] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const addModal = useDisclosure();
  const createModal = useDisclosure();
  const playDrawer = useDisclosure();
  const { login, isAdmin } = useContext(LoginContext);
  const [addPlaylist, setAddPlaylist] = useState([]);
  const [value, setValue] = useState(1);
  const toast = useToast();
  const [inputCount, setInputCount] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  const [index, setIndex] = useState(0);
  const isSubmit = useRef(true);
  const [currentName, setCurrentName] = useState("");
  const [isPlaylistSubmit, setIsPlaylistSubmit] = useState(false);

  const [play, updatePlay] = useImmer([]);

  // 플레이리스트 이미지 삽입
  const [imagePreview, setImagePreview] = useState(
    "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/prj2/playlist/default/defaultplaylist.jpg",
  );
  const [coverImage, setCoverImage] = useState("");
  const freader = new FileReader();

  // ↓ 더보기 버튼 생성 useState
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    axios.put("/api/song/plusSongPoint", { id });
    axios.get("/api/song/" + id).then(({ data }) => {
      setSongData(data);
      updatePlay((draft) => {
        draft.push(data);
      });
      axios
        .get("/api/song/albumList?id=" + id)
        .then(({ data }) => setAlbumList(data));
    });
    window.scrollTo(0, 0);
  }, []);

  function handleAddModal() {
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
        isSubmit.current = true;
        addModal.onClose();
      });
  }

  function handleCreatePlaylist() {
    axios
      .postForm("/api/myList/createPlaylist", {
        listName: currentName,
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
      .get("/api/myList/check?" + params + "&memberId=" + login.id)
      .then(() => {
        toast({
          description: "이미 사용중인 이름입니다.",
          status: "warning",
        });
        setIsPlaylistSubmit(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "사용 가능한 이름입니다.",
            status: "success",
          });
          setIsPlaylistSubmit(true);
          setCurrentName(playlistName);
        }
      });
  }

  function handleGoToSong(id) {
    navigate(`/main/song/${id}`);
    window.location.reload(0);
    window.scrollTo(0, 0);
  }

  return (
    <Box mt={"100px"}>
      <Center>
        <Flex>
          {/* 이미지 출력 */}
          <Box mr={8}>
            <Image
              style={{
                maxWidth: "400px",
                height: "400px",
              }}
              src={songData.artistFileUrl}
              alt={`${songData.artistName}-${songData.title}`}
              boxSize="400px"
              minW={"400px"}
            />

            {/* 수정&삭제 버튼은 admin만 보일 수 있게 */}
            {isAdmin() && (
              <Button
                onClick={() => navigate("/main/songEdit/" + id)}
                background={"plum"}
                size={"sm"}
                mt={"10px"}
              >
                수정
              </Button>
            )}
          </Box>

          {/*<Box>{songData.id}</Box>*/}
          <Box>
            <Flex gap={5} alignItems={"center"}>
              <Heading fontSize="30px">{songData.title}</Heading>
              <KakaoShareComp
                title={songData.title}
                imageUrl={songData.artistFileUrl}
              />
              <Box cursor={"pointer"} onClick={handleAddModal}>
                <Tooltip label="플레이리스트에 추가" fontSize="0.6rem">
                  <FontAwesomeIcon icon={faPlus} />
                </Tooltip>
              </Box>
              <Box cursor={"pointer"} onClick={playDrawer.onOpen}>
                <Tooltip label="재생" fontSize="0.6rem">
                  <FontAwesomeIcon icon={faCirclePlay} />
                </Tooltip>
              </Box>
              {play.length !== 0 && (
                <PlayComp
                  isOpen={playDrawer.isOpen}
                  onClose={playDrawer.onClose}
                  index={index}
                  setIndex={setIndex}
                  songList={play}
                />
              )}
            </Flex>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  가수
                </FormLabel>
                <div>{songData.artistName}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  앨범명
                </FormLabel>
                <div>{songData.album}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  그룹명
                </FormLabel>
                <div>{songData.artistGroup}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  장르
                </FormLabel>
                <div>{songData.genre}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  무드
                </FormLabel>
                <div>{songData.mood}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  발매일
                </FormLabel>
                <div>{songData.release}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel w={"50px"} fontWeight={"bold"}>
                  가사
                </FormLabel>
                <Box w={"700px"}>
                  {songData.lyric && (
                    <>
                      {showMore
                        ? songData.lyric
                        : `${songData.lyric.slice(0, 20)}...`}
                      {songData.lyric.length > 20 && (
                        <Button
                          background={"lavender"}
                          ml={5}
                          size={"xs"}
                          onClick={() => setShowMore(!showMore)}
                        >
                          {showMore ? "닫기" : "더 보기"}

                          {/* 닫기에는 up화살표 적용, 더 보기에는 down 아이콘 적용 */}
                          <FontAwesomeIcon
                            icon={showMore ? faChevronUp : faChevronDown}
                          />
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Center>
      <Center>
        <Box
          w="1200px"
          mr={8}
          flexShrink={0}
          // position="absolute"
          left="0" // 뷰포트의 왼쪽에 위치
          top="1000px" // 뷰포트의 상단에서 100px 아래에 위치
        >
          <CommentContainer songId={id} />
        </Box>
      </Center>
      <Box mb={"70"}>
        {/* <SongList album={album.current} /> */}
        <Center>
          <Box
            w={{ base: "100%", md: "1200px" }}
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <br />
            <Heading flexWrap={"wrap"} size={"md"} ml={7}>
              곡 정보
            </Heading>
            <br />
            <Box
              style={{
                position: "relative", // 부모 컨테이너가 상대 위치여야 자식 엘리먼트를 절대 위치로 설정할 수 있습니다.
                overflowX: "auto", // 가로 스크롤을 추가하여 내용이 줄어들 때 스크롤 가능하도록 함
              }}
            >
              <Table
                style={{
                  minWidth: "1200px", // Table의 최소 너비를 100%로 설정하여 줄어들지 않도록 함
                  tableLayout: "fixed",
                }}
              >
                <Thead>
                  <Tr>
                    <Th
                      style={{
                        width: "100px",
                        textAlign: "center",
                        position: "sticky",
                        left: 0,
                        zIndex: 3,
                      }}
                    >
                      번호
                    </Th>
                    <Th style={{ width: "350px", textAlign: "center" }}>
                      제목
                    </Th>
                    <Th style={{ width: "350px", textAlign: "center" }}>
                      앨범명
                    </Th>
                    <Th style={{ width: "200px", textAlign: "center" }}>
                      출시일
                    </Th>
                    <Th style={{ width: "200px", textAlign: "center" }}>
                      장르
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {albumList !== null &&
                    albumList.map((album) => (
                      <Tr key={album.id}>
                        <Td
                          style={{
                            width: "100px",
                            textAlign: "center",
                            position: "sticky",
                            left: 0,
                            zIndex: 3,
                          }}
                        >
                          {album.songId}
                        </Td>
                        <Td
                          style={{ width: "350px", textAlign: "center" }}
                          cursor={"pointer"}
                          onClick={() => handleGoToSong(album.id)}
                        >
                          {album.title}
                        </Td>
                        <Td style={{ width: "350px", textAlign: "center" }}>
                          {album.album}
                        </Td>
                        <Td style={{ width: "200px", textAlign: "center" }}>
                          {album.release}
                        </Td>
                        <Td style={{ width: "200px", textAlign: "center" }}>
                          {album.genre}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Center>
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
        <Modal
          isOpen={createModal.isOpen}
          onClose={() => {
            createModal.onClose();
            setInputCount(0);
          }}
        >
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
                  maxLength="8"
                  placeholder="이름 지정"
                />
                <Button variant="ghost" onClick={handleCheckPlaylistName}>
                  중복확인
                </Button>
              </Flex>
              <Text textAlign="left">
                생성될 이름: {currentName} ({inputCount} / 8)
              </Text>
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
                isDisabled={
                  !isPlaylistSubmit ||
                  playlistName.length === 0 ||
                  playlistName !== currentName
                }
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
