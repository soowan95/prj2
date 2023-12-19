import React, { useContext, useEffect, useRef, useState } from "react";
import {
  border,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEllipsis,
  faPenToSquare,
  faPlay,
  faQrcode,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import PlayComp from "../../component/PlayComp";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import KakaoShareComp from "../../component/KakaoShareComp";

// 내 플레이리스트에서 플레이리스트 클릭시
export function ChartPage() {
  const [songList, setSongList] = useState(null);
  const [list, setList] = useState(null);
  const toast = useToast();
  const [params] = useSearchParams();
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const editModal = useDisclosure();
  const listIndex = useRef(0);
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);
  const editPlaylistModal = useDisclosure();
  const [playlistName, setPlaylistName] = useState("");
  const [inputCount, setInputCount] = useState(0);

  // 플레이리스트 이미지 수정
  const [imagePreview, setImagePreview] = useState(
    "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/prj2/playlist/default/defaultplaylist.jpg",
  );
  const [coverImage, setCoverImage] = useState("");
  const freader = new FileReader();

  useEffect(() => {
    const param = new URLSearchParams();
    param.set("id", login.id);

    axios
      .get("/api/myList/getByListId?listId=" + params.get("listId"))
      .then(({ data }) => {
        setList(data);
      });
    axios
      .get("/api/song/chartlist?id=" + params.get("listId"))
      .then(({ data }) => setSongList(data));
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
          description: "삭제되었습니다",
          status: "info",
        });
        window.location.reload(0);
      })
      .catch(() => {
        toast({
          description: "삭제중 문제가 발생하였습니다",
          status: "warning",
        });
      });
  }

  function handleDeletePlaylist() {
    axios
      .delete("/api/myList/" + list.listId)
      .then(() => {
        toast({
          description: "삭제가 완료되었습니다",
          status: "success",
        });
        navigate("/main/myplaylist");
      })
      .catch(() => {
        toast({
          description: "삭제중 문제가 발생하였습니다",
          status: "warning",
        });
      });
  }

  function handleEditPlaylist() {
    axios
      .putForm("/api/myList/editPlaylist", {
        id: list.listId,
        listName: playlistName === "" ? list.listName : playlistName,
        coverimage: coverImage,
      })
      .then(() => {
        toast({
          description: "수정이 완료되었습니다",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "수정중 문제가 발생하였습니다.",
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
            <Box ml={"50px"} mr={8} border="1px solid black">
              <Image
                src={list !== null && list.photo}
                boxSize="350px"
                objectFit="cover"
                style={{ margin: "0 auto", display: "block" }}
              />
            </Box>
            <Box>
              <Flex alignItems={"center"} gap={5}>
                <Heading fontSize="30px" color="black">
                  {list !== null && list.listName}
                </Heading>
                <KakaoShareComp
                  title={list !== null && list.listName}
                  imageUrl={list !== null && list.photo}
                />
              </Flex>
              <Flex>
                <FormLabel>
                  작성자
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {list != null && list.nickName}
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>
                  곡수
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {list !== null && list.totalSongCount} 곡
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>
                  조회수
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {params.get("count")} 회
                </FormLabel>
              </Flex>
              <Flex>
                <FormLabel>작성일 {list !== null && list.inserted}</FormLabel>
              </Flex>
              <Flex>
                <Button
                  variant="ghost"
                  rightIcon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={handleDeletePlaylist}
                >
                  플레이리스트 삭제
                </Button>
              </Flex>
              <Flex>
                <Button
                  variant="ghost"
                  rightIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={editPlaylistModal.onOpen}
                >
                  플레이리스트 수정
                </Button>
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
                <Th
                  // border={"1px solid black"}
                  width={"40px"}
                  p={0}
                >
                  <Box
                    // border={"1px solid red"}
                    width={"30px"}
                    ml={"40px"}
                  >
                    재생
                  </Box>
                </Th>
                <Th
                  // border={"1px solid blue"}
                  width={"10px"}
                  p={0}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;정보
                </Th>
                <Th
                  // border={"1px solid blue"}
                  width={"100px"}
                  p={0}
                >
                  <Box
                    // border={"1px solid red"}
                    mr={"50px"}
                  >
                    &nbsp;&nbsp;삭제
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
                    <Td
                      // border={"1px solid red"}
                      p={0}
                    >
                      <Button
                        variant="ghost"
                        // border={"1px solid blue"}
                        width={"40px"}
                        ml={"35px"}
                        onClick={() => {
                          setIndex(idx);
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
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Button>
                    </Td>
                    <Td p={1}>
                      <Button
                        p={0}
                        borderRadius={0}
                        variant="ghost"
                        // border={"1px solid blue"}
                        ml={"-5px"}
                        onClick={() => {
                          listIndex.current = idx;
                          editModal.onOpen();
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
        {songList !== null && songList.length !== 0 && (
          <PlayComp
            isOpen={playModal.isOpen}
            onClose={playModal.onClose}
            songList={songList}
            index={index}
            setIndex={setIndex}
          />
        )}
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
                    songList.at(listIndex).id,
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

        {/* 플레이리스트 수정 모달 */}
        <Modal
          isOpen={editPlaylistModal.isOpen}
          onClose={editPlaylistModal.onClose}
        >
          <ModalContent>
            <ModalHeader>플레이리스트 수정</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>이름 수정</FormLabel>
                <Flex>
                  <Input
                    value={playlistName}
                    onChange={(e) => {
                      setPlaylistName(e.target.value);
                      setInputCount(e.target.value.length);
                    }}
                    maxLength="14"
                    placeholder={list !== null && list.listName}
                  />

                  <Button variant="ghost" onClick={handleCheckPlaylistName}>
                    중복확인
                  </Button>
                </Flex>
                <FormHelperText textAlign="right">
                  {inputCount} / 15
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>사진 변경</FormLabel>
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
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleEditPlaylist}>
                수정
              </Button>
              <Button variant="ghost" onClick={editPlaylistModal.onClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default ChartPage;
