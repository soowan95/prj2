import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

export function SongList({ album }) {
  const [albumList, setAlbumList] = useState(null);

  useEffect(() => {
    axios
      .get("/api/song/albumList?album=" + album)
      .then((response) => setAlbumList(response.data));
  }, [album]);

  return (
    <Box>
      <br />

      <Heading size={"md"}>수록곡</Heading>
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
  );
}

export default SongList;