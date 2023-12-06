import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";

export function RecommendedList() {
  const [recommendedList, setRecommendedList] = useState(null);
  const { fetchLogin } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/myList/recommended")
      .then((response) => {
        setRecommendedList(response.data);
      })
      .finally(() => fetchLogin());
  }, []);

  return (
    <>
      <Divider />
      <Heading>추천 재생목록</Heading>
      <Divider />
      <Table>
        <Thead>
          <Tr>
            <Th>제목</Th>
            <Th>아티스트</Th>
            <Th>앨범</Th>
            <Th>발매일</Th>
            <Th>장르</Th>
            <Th>가사</Th>
          </Tr>
        </Thead>
        <Tbody>
          {recommendedList !== null &&
            recommendedList.map((songList) => (
              <Tr key={songList.id}>
                <Td>{songList.title}</Td>
                <Td>{songList.name}</Td>
                <Td>{songList.album}</Td>
                <Td>{songList.release}</Td>
                <Td>{songList.genre}</Td>
                <Td>{songList.lyric}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </>
  );
}
