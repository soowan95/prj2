import { CommentContainer } from "../../component/CommentContainer";
import { MemberLogin } from "../memberLogin/MemberLogin";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
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
import { faBold, faComputerMouse } from "@fortawesome/free-solid-svg-icons";
import Counter from "./Counter";
import { useNavigate, useParams } from "react-router-dom";
import SongList from "./SongList";
import KakaoShareComp from "../../component/KakaoShareComp";
import { number } from "sockjs-client/lib/utils/random";

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
      <Center>
        <Flex>
          {/* 가수 이미지 출력 */}
          <Box mr={8}>
            <Image
              src={songData.artistFileUrl}
              alt={`${songData.artistName}-${songData.title}`}
              boxSize="400px"
              objectFit="cover"
            />

            {/* 수정&삭제 버튼은 admin만 보일 수 있게 */}
            <Button
              onClick={() =>
                navigate(
                  "/main/songEdit?title=" +
                    songData.title +
                    "&artistName=" +
                    songData.artistName +
                    "&album=" +
                    songData.album +
                    "&artistGroup=" +
                    songData.artistGroup +
                    "&url=" +
                    songData.artistFileUrl,
                )
              }
              background={"aliceblue"}
              size={"xs"}
              mt={"10px"}
            >
              수정
            </Button>
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
                <FormLabel fontWeight={"bold"}>가수</FormLabel>

                <div>{songData.artistName}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>앨범명</FormLabel>
                <div>{songData.album}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>그룹명</FormLabel>
                <div>{songData.artistGroup}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>장르</FormLabel>
                <div>{songData.genre}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>무드</FormLabel>
                <div>{songData.mood}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>발매일</FormLabel>
                <div>{songData.release}</div>
              </Flex>
            </Box>
            <Box mt={4}>
              <Flex>
                <FormLabel fontWeight={"bold"}>가사</FormLabel>
                <div>{songData.lyric}</div>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Center>
      <Center>
        <Box w="1200px">
          <CommentContainer songId={id} />
        </Box>
      </Center>
      <Box>
        {/*<SongList album={album.current} />*/}
        <Center>
          <Box w={"1200px"}>
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
        </Center>
      </Box>
    </Box>
  );
}

export default SongPage;
