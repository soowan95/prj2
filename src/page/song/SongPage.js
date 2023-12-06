import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, FormLabel, Heading, Image } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

function SongPage(props) {
  const [songData, setSongData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => setSongData(data));
  }, []);

  console.log(songData);
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
    </Box>
  );
}

export default SongPage;
