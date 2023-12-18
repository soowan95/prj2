import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider";
import {
  Box,
  Center,
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
    <Center>
      <Box
        w={{ base: "100%", md: "1200px" }}
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <Heading size={"md"} marginLeft={"30px"} marginTop={"50px"}>
          나의 요청 목록
        </Heading>
        <br />
        <br />

        <Box
          style={{
            position: "relative", // 부모 컨테이너가 상대 위치여야 자식 엘리먼트를 절대 위치로 설정할 수 있습니다.
            overflowX: "auto", // 가로 스크롤을 추가하여 내용이 줄어들 때 스크롤 가능하도록 함
          }}
        >
          <Table
            style={{
              minWidth: "1200px", // Table의 최소 너비를 100%로 설정하여 줄어들지 않도록 함
              tableLayout: "fixed",
            }}
          >
            <Thead>
              <Tr>
                <Th
                  style={{ position: "sticky", left: 0, zIndex: 3 }}
                  w={"200px"}
                >
                  요청자 ID
                </Th>
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
                requestList.filter(
                  (request) => !request.updated && request.member === login.id,
                ).length === 0 &&
                requestList.length === 0 && (
                  // 사용자가 요청한 기록이 전혀 없을 때만 메시지 표시
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
    </Center>
  );
}

export default MySongRequest;
