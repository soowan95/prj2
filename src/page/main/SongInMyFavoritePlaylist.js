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
import { AddIcon } from "@chakra-ui/icons";

function SongInMyFavoritePlaylist() {
  const { login } = useContext(LoginContext);
  const [params] = useSearchParams();
  const [songList, setSongList] = useState(null);
  const [index, setIndex] = useState(null);
  const playModal = useDisclosure();
  const listIndex = useRef(0);
  const [list, setList] = useState(null);

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
                src="https://image.genie.co.kr/Y/IMAGE/Playlist/Channel/GENIE/PLAYLIST_20231128121036.png/dims/resize/Q_80,0"
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
                  {list != null && list.nickName} 님
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
        <Divider />
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>번호</Th>
                <Th>제목</Th>
                <Th>아티스트</Th>
                <Th>앨범</Th>
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
                          setIndex(song.indexForPlay);
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
                        }}
                      >
                        <AddIcon boxSize={4} />
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
      </Box>
    </>
  );
}
export default SongInMyFavoritePlaylist;
