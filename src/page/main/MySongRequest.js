import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function MySongRequest() {
  const { login } = useContext(LoginContext);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    // 사용자 ID를 기반으로 요청된 노래를 가져옵니다.
    axios.get(`/api/song/mySongRequestList`).then((response) => {
      setRequestList(response.data);
    });
  }, [login.id]);

  return (
    <Box>
      <Heading size={"md"} marginLeft={"30px"} marginTop={"50px"}>
        나의 요청 목록
      </Heading>
      <br />
      <br />

      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th w={"200px"}>요청자 ID</Th>
              <Th w={"200px"}>가수</Th>
              <Th w={"400px"}>노래 제목</Th>
              <Th w={"200px"}>진행 상태</Th>
            </Tr>
          </Thead>

          <Tbody>
            {requestList !== null &&
              requestList
                // 로그인 된 사용자의 요청 목록만 보이게 만들기
                // 아직 입력이 처리 중인 경우
                .filter((a) => !a.updated && a.member === login.id)
                .map((request) => (
                  <Tr key={request.id} textAlign="center">
                    <Td>{request.member}</Td>
                    <Td>{request.artist}</Td>
                    <Td>{request.title}</Td>
                    <Td>처리 중</Td>
                  </Tr>
                ))}
            {requestList !== null &&
              requestList
                // 사용자의 요청 목록이 없는 경우
                .filter(
                  (request) => !request.updated && request.member === login.id,
                ).length === 0 && (
                <Tr>
                  <Td colSpan={4}>
                    <Text>요청한 내역이 없습니다.</Text>
                  </Td>
                </Tr>
              )}
            {requestList !== null &&
              // 이미 입력이 완료되어 처리된 요청 목록 표시
              requestList
                .filter(
                  (request) => request.member === login.id && request.updated,
                )
                .map((request) => (
                  <Tr key={request.id} textAlign="center">
                    <Td>{request.member}</Td>
                    <Td>{request.artist}</Td>
                    <Td>{request.title}</Td>
                    <Td>처리 완료</Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default MySongRequest;
