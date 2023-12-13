import React, { useContext, useEffect, useRef, useState } from "react";
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
  // 사용자의 로그인 정보를 가져오기 위해 LoginProvider에서 제공되는 컨텍스트 사용
  const { login } = useContext(LoginContext);
  // 요청된 노래 목록을 상태로 관리
  const [requestList, setRequestList] = useState([]);
  // 로딩 상태 추가
  const loadingRef = useRef(true);

  // 컴포넌트가 마운트되거나 사용자 ID가 변경될 때 실행되는 효과
  // "마운트"되었다는 것은 React에서 해당 컴포넌트가 DOM에 추가되어 화면에 표시될 때
  // 'login.id'가 변경될 때마다 'axios.get'이 호출되어 데이터를 가져오게 됨
  // 컴포넌트가 마운트되거나 사용자 ID가 변경될 때 데이터를 서버에서 가져옴
  useEffect(() => {
    // useRef를 사용하여 로딩 상태를 관리
    loadingRef.current = true;

    // 사용자 ID를 기반으로 요청된 노래를 가져옵니다.
    axios
      .get(`/api/song/mySongRequestList`)
      .then((response) => {
        setRequestList(response.data);
      })
      .catch((error) => {
        console.error("노래 목록을 가져오는 중 오류 발생:", error);
      })
      .finally(() => {
        // 비동기 요청이 완료되면 로딩 상태를 false로 업데이트
        loadingRef.current = false;
        // 컴포넌트가 다시 렌더링되도록 강제 업데이트
        forceUpdate();
      });
  }, [login.id]);

  // 강제로 컴포넌트를 다시 렌더링하기 위한 함수
  const [, forceUpdate] = useState();

  // JSX 반환
  return (
    <Box>
      <Heading size={"md"} marginLeft={"30px"} marginTop={"50px"}>
        나의 요청 목록
      </Heading>
      <br />
      <br />

      <Box>
        {loadingRef.current ? (
          <Text>요청한 내역을 불러오는 중...</Text>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}

export default MySongRequest;
