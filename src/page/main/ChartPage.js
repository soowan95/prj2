import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormLabel,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export function ChartPage() {
  const [songList, setSongList] = useState(null);
  const [list, setList] = useState(null);
  const [params] = useSearchParams();

  useEffect(() => {
    //차트의 설명을 하고 싶어서 setList를 입력
    axios.get("/api/myList/get").then(({ data }) => {
      setList(data);
    });
    axios
      .get("/api/song/chartlist?id=" + params.get("listId"))
      .then(({ data }) => setSongList(data));
  }, []);

  return (
    <>
      <Box>
        <Flex flexDirection="rew">
          <Box mr={8} border="1px solid black">
            <Image
              src="https://image.genie.co.kr/Y/IMAGE/Playlist/Channel/GENIE/PLAYLIST_20231128121036.png/dims/resize/Q_80,0"
              boxSize="400px"
              objectFit="cover" // 이미지가 상자를 완전히 덮도록 크기 조절하는 것
            />
          </Box>

          <Box>
            <Heading fontSize="30px" color="purple">
              {/*{list.memberId}*/}
            </Heading>
            <Flex>
              <FormLabel>제작자</FormLabel>
              {/*<div>{list.listName}</div>*/}
            </Flex>
            <Flex>
              <FormLabel>곡수</FormLabel>
              {/*<div>{list.listId}</div>*/}
            </Flex>
            <Flex>
              <FormLabel>조회수</FormLabel>
              {/*<div>{list.listId}</div>*/}
            </Flex>
            <Flex>
              <FormLabel>업데이트</FormLabel>
              {/*<div>{list.listId}</div>*/}
            </Flex>
          </Box>
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
                <Th>듣기</Th>
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
                    <Td>{song.mood}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
}

export default ChartPage;
