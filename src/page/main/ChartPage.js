import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
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
import { faEllipsis, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import PlayComp from "../../component/PlayComp";
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

  return (
    <>
      <Box>
        <Flex>
          <Flex flexDirection="row">
            <Box mr={8} border="1px solid black">
              <Image
                src={
                  songList !== null &&
                  songList.length !== 0 &&
                  songList
                    .filter((a) => a.artistFileUrl.indexOf("default") === -1)
                    .filter((a) => a.artistFileUrl.lastIndexOf("http") === 0)
                    .at(0).artistFileUrl
                }
                boxSize="220px"
                objectFit="cover"
                style={{ margin: "0 auto", display: "block" }}
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
                <FormLabel>작성일 {list !== null && list.inserted}</FormLabel>
              </Flex>
              <Flex>
                <FormLabel>플레이리스트 삭제</FormLabel>
                <Button variant="ghost" onClick={handleDeletePlaylist}>
                  <FontAwesomeIcon icon={faTrash} />
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
                <Th>재생</Th>
                <Th>정보</Th>
                <Th>삭제</Th>
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
                      <Button borderRadius={0} variant="ghost">
                        <Popover>
                          <PopoverTrigger>
                            <FontAwesomeIcon icon={faEllipsis} />
                          </PopoverTrigger>
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
      </Box>
    </>
  );
}

export default ChartPage;
