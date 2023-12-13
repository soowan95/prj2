import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";
import {
  Box,
  Button,
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
  const navigate = useNavigate();
  const [albumList, setAlbumList] = useState(null);
  const [songData, setSongData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => {
      setSongData(data);
      axios
        .get("/api/song/albumList?album=" + data.album)
        .then(({ data }) => setAlbumList(data));
    });
  }, []);

  useEffect(() => {
    // 사용자 ID를 기반으로 요청된 노래를 가져옵니다.
    axios.get(`/api/song/mySongRequestList`).then((response) => {
      setRequestList(response.data);
    });
  }, [login.id]);

  // SongPage로 이동할 때 필요한 정보를 가져오는 함수
  function getSongIdFromArtistAndTitle(artist, title) {
    // 여기에서 알맞은 로직으로 artist와 title에 대응하는 songId를 찾아서 반환
    // 예시로 albumList를 사용해서 찾는 로직을 작성했습니다.
    const foundAlbum = albumList.find(
      (album) => album.name === artist && album.title === title,
    );

    if (foundAlbum) {
      return foundAlbum.id; // 예시로 찾은 album의 id를 반환
    } else {
      // 적절한 로직으로 찾지 못했을 경우 처리
      console.error(`Song not found for artist: ${artist}, title: ${title}`);
      return null;
    }
  }

  // MySongRequest에서 SongPage로 이동하는 함수
  function handleCompleteRequest(artist, title) {
    // SongPage로 이동할 때 필요한 정보 가져오기
    const songId = getSongIdFromArtistAndTitle(artist, title);

    // 이동할 경로 생성
    const path = `/main/song/${songId}`;

    // 페이지 이동
    navigate(path);
  }

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
                    <Td>
                      <Button
                        onClick={() =>
                          handleCompleteRequest(request.artist, request.title)
                        }
                      >
                        처리 완료
                      </Button>
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default MySongRequest;
