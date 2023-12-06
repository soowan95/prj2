import React, { useEffect, useState } from "react";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";

export function ChartPage() {
  const [songList, setSongList] = useState(null);
  useEffect(() => {
    axios
      .get("/api/song/chartlist")
      .then((response) => setSongList(response.data));
  }, []);
  return (
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
  );
}

export default ChartPage;
