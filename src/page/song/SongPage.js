import {CommentContainer} from "../../component/CommentContainer";
import {MemberLogin} from "../memberLogin/MemberLogin";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
  Box, Button,
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
  Tr
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComputerMouse} from "@fortawesome/free-solid-svg-icons";
import Counter from "./Counter";
import {useParams} from "react-router-dom";
import SongList from "./SongList";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const [albumList, setAlbumList] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    axios.get("/api/song/" + id).then(({data}) => {
      setSongData(data);
      axios.get("/api/song/albumList?album=" + data.album)
        .then(({data}) => setAlbumList(data));
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
          <Heading fontSize="30px" color="purple">
            {songData.title}
          </Heading>
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
              <FormLabel>장르</FormLabel>
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
          <br/>
          <Heading size={"md"}>곡 정보</Heading>
          <br/>
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
                  albumList.map((album=>(

                    <Tr>
                      <Td>{album.id}</Td>
                      <Td>{album.title}</Td>
                      <Td>{album.name}</Td>
                      <Td>{album.album}</Td>
                      <Td>{album.release}</Td>
                      <Td>{album.genre}</Td>
                    </Tr>
                  )))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SongPage;
