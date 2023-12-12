import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  FormLabel,
  Heading,
  Image,
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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import PlayComp from "../../component/PlayComp";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export function TopPlaylist() {
  const [params] = useSearchParams();
  const [playlistByListId, setPlaylistByListId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/myList/topPlaylist?listId=" + params.get("listId"))
      .then((response) => setPlaylistByListId(response.data));
  }, []);

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
              <FormLabel>
                작성자 : {playlistByListId && playlistByListId.at(0).memberId}
              </FormLabel>
            </Flex>
            <Flex>
              <FormLabel>
                조회수 :{" "}
                {playlistByListId && playlistByListId.at(0).myplaylistcount}
              </FormLabel>
            </Flex>
          </Box>
        </Flex>
        {/*<Card mt={50}>*/}
        {/*  <Box>*/}
        {/*    <Table mt={50}>*/}
        {/*      <Thead>*/}
        {/*        <Tr>*/}
        {/*          <Th>번호</Th>*/}
        {/*          <Th>제목</Th>*/}
        {/*          <Th>아티스트</Th>*/}
        {/*          <Th>재생</Th>*/}
        {/*          <Th>정보</Th>*/}
        {/*          <Th>삭제</Th>*/}
        {/*        </Tr>*/}
        {/*      </Thead>*/}
        {/*      <Tbody>*/}
        {/*        {topPlaylist !== null &&*/}
        {/*          topPlaylist.map((songList, idx) => (*/}
        {/*            <Tr>*/}
        {/*              <Td>{songList.indexForPlay + 1}</Td>*/}
        {/*              <Td>{songList.title}</Td>*/}
        {/*              <Td>{songList.artistName}</Td>*/}
        {/*              <Td>*/}
        {/*                <Button*/}
        {/*                  borderRadius={0}*/}
        {/*                  variant="ghost"*/}
        {/*                  onClick={() => {*/}
        {/*                    setIndex(songList.indexForPlay);*/}
        {/*                    playModal.onOpen();*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  <FontAwesomeIcon icon={faPlay} />*/}
        {/*                </Button>*/}
        {/*              </Td>*/}
        {/*              <Td>*/}
        {/*                <Button borderRadius={0} variant="ghost">*/}
        {/*                  <Popover>*/}
        {/*                    <PopoverTrigger>*/}
        {/*                      <FontAwesomeIcon icon={faEllipsis} />*/}
        {/*                    </PopoverTrigger>*/}
        {/*                    <PopoverContent>*/}
        {/*                      <PopoverArrow />*/}
        {/*                      <PopoverCloseButton />*/}
        {/*                      <PopoverHeader>곡 정보</PopoverHeader>*/}
        {/*                      <PopoverBody textAlign="left">*/}
        {/*                        제목 : {songList.title} <br />*/}
        {/*                        아티스트 : {songList.artistName} <br />*/}
        {/*                        앨범 : {songList.album} <br />*/}
        {/*                        발매일 : {songList.release} <br />*/}
        {/*                        장르 : {songList.genre}*/}
        {/*                      </PopoverBody>*/}
        {/*                    </PopoverContent>*/}
        {/*                  </Popover>*/}
        {/*                </Button>*/}
        {/*              </Td>*/}
        {/*              <Td>*/}
        {/*                <Button*/}
        {/*                  borderRadius={0}*/}
        {/*                  variant="ghost"*/}
        {/*                  onClick={() => {*/}
        {/*                    listIndex.current = idx;*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  <FontAwesomeIcon icon={faTrash} />*/}
        {/*                </Button>*/}
        {/*              </Td>*/}
        {/*            </Tr>*/}
        {/*          ))}*/}
        {/*      </Tbody>*/}
        {/*    </Table>*/}
        {/*  </Box>*/}
        {/*  <PlayComp*/}
        {/*    songList={recommendList}*/}
        {/*    index={index}*/}
        {/*    setIndex={setIndex}*/}
        {/*  />*/}
        {/*</Card>*/}
      </Box>
    </Center>
  );
}

export default TopPlaylist;
