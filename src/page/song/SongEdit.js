import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SongRequest from "../main/SongRequest";

export function SongEdit() {
  const navigate = useNavigate();
  const [songData, setSongData] = useState({});
  const [song, updateSong] = useImmer(null);
  // /songEdit/:id
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => updateSong(data));
  }, []);

  return (
    <Box>
      <br />

      <Flex>
        {/* 삭제할 기존 사진 */}
        <Box mr={8}>
          <Image
            src={songData.artistFileUrl}
            boxSize="400px"
            objectFit="cover"
          />
        </Box>

        {/* 수정할 데이터 */}
        <Box>
          <Heading fontSize="30px" color="purple">
            {songData.title}
          </Heading>
          <br />
          <Flex>
            <FormLabel>가수</FormLabel>
            <div>{songData.artistName}</div>
          </Flex>
        </Box>
      </Flex>

      {/* 수정할 새로 넣을 사진 */}
      <Box>
        <Input type="file" />

        <Flex>
          <Button>저장</Button>
          <Button>취소</Button>
        </Flex>
      </Box>
    </Box>
  );
}
