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
import { useParams } from "react-router-dom";
import SongList from "./SongList";
import KakaoShareComp from "../../component/KakaoShareComp";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const [albumList, setAlbumList] = useState(null);
  const { id } = useParams();

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
      <Flex>
        {/* 노래 사진 */}
        <Box mr={8}>
          <Image
            src="songData.image"
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
              imageUrl={
                "image/jpeg;base64,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"
              }
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
