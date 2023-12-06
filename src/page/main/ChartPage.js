import React, { useEffect, useState } from "react";
import {Box, Flex, FormLabel, Heading, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import axios from "axios";

export function ChartPage() {
  const [songList, setSongList] = useState(null);
  const [allList, setAllList] = useState(null);
// playList 다 가져오기
  useEffect(() => {
    axios.get("/api/myList/getAll")
      .then(({ data}) => setAllList(data));
  }, []);

  // song곡들 데이터베이스에서 가져 오기
  useEffect(() => {
    axios
      .get("/api/song/chartlist")
      .then((response) => setSongList(response.data));
  }, []);
  return (
    <>
    {/*  /!*  플레이리스트 맨위 설명*!/*/}
    {/*  <Flex>*/}
    {/*    {allList !== null &&*/}
    {/*    alllist.map((list) => (*/}
    {/*<Box>*/}
    {/*  <Heading fontSize="30px" color="purple">*/}
    {/*    {list.listName}*/}
    {/*  </Heading>*/}
    {/*  <Box mt={4}>*/}
    {/*    <Flex>*/}
    {/*      <FormLabel>가수</FormLabel>*/}
    {/*      <div>{list.listName}</div>*/}
    {/*    </Flex>*/}
    {/*  </Box>*/}
    {/*  <Box mt={4}>*/}
    {/*    <Flex>*/}
    {/*      <FormLabel>제작사</FormLabel>*/}
    {/*      <div>{list.listId}</div>*/}
    {/*    </Flex>*/}
    {/*  </Box>*/}
    {/*  <Box mt={4}>*/}
    {/*    <Flex>*/}
    {/*      <FormLabel>조회수</FormLabel>*/}
    {/*      <div>{list.listId}</div>*/}
    {/*    </Flex>*/}
    {/*  </Box>*/}
    {/*  <Box mt={4}>*/}
    {/*    <Flex>*/}
    {/*      <FormLabel>최초생성</FormLabel>*/}
    {/*      <div>{list.listId}</div>*/}
    {/*    </Flex>*/}
    {/*  </Box>*/}
    {/*  <Box mt={4}>*/}
    {/*    <Flex>*/}
    {/*      <FormLabel>곡수</FormLabel>*/}
    {/*      <div>{list.listId}</div>*/}
    {/*    </Flex>*/}
    {/*  </Box>*/}
    {/*</Box>*/}
    {/*    ))}*/}
    {/*  </Flex>*/}



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
              songList.map((song) => (
                <Tr>
                  <Td>{song.id}</Td>
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
