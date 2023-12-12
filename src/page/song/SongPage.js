import { CommentContainer } from "../../component/CommentContainer";
import { MemberLogin } from "../memberLogin/MemberLogin";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputerMouse } from "@fortawesome/free-solid-svg-icons";
import Counter from "./Counter";
import { useNavigate, useParams } from "react-router-dom";
import SongList from "./SongList";
import KakaoShareComp from "../../component/KakaoShareComp";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const [albumList, setAlbumList] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => {
      setSongData(data);
      axios
        .get("/api/song/albumList?album=" + data.album)
        .then(({ data }) => setAlbumList(data));
    });
  }, []);

  return (
    <Box mt={"100px"}>
      {/* 수정&삭제 버튼은 admin만 보일 수 있게 */}
      <Button
        onClick={() => navigate("/songEdit/" + id)}
        background={"aliceblue"}
        size={"sm"}
        mb={"40px"}
      >
        수정
      </Button>

      <Flex>
        {/* 가수 이미지 출력 */}
        <Box mr={8}>
          <Image
            src={songData.artistFileUrl}
            alt={`${songData.artistName}-${songData.title}`}
            boxSize="400px"
            objectFit="cover"
          />
        </Box>

        {/*<Box>{songData.id}</Box>*/}
        <Box>
          <Flex gap={5} alignItems={"center"}>
            <Heading fontSize="30px" color="purple">
              {songData.title}
            </Heading>
            <KakaoShareComp
              title={songData.title}
              description={songData.genre + "&" + songData.mood}
              imageUrl={songData.artistFileUrl}
            />
          </Flex>
          <Box mt={4}>
            <Flex>
              <FormLabel>가수</FormLabel>
              <div>{songData.artistName}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>앨범명</FormLabel>
              <div>{songData.album}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>그룹명</FormLabel>
              <div>{songData.artistGroup}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>장르</FormLabel>
              <div>{songData.genre}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>무드</FormLabel>
              <div>{songData.mood}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>발매일</FormLabel>
              <div>{songData.release}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>가사</FormLabel>
              <div>{songData.lyric}</div>
            </Flex>
          </Box>
        </Box>
      </Flex>
      <CommentContainer songId={id} />
      <Box>
        {/*<SongList album={album.current} />*/}
        <Box>
          <br />
          <Heading size={"md"}>곡 정보</Heading>
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
      </Box>
    </Box>
  );
}

export default SongPage;
