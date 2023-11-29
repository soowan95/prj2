import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Heading,
  Flex,
  Image,
} from "@chakra-ui/react";
import { SongContext } from "../../layout/MainLayout";
import { Form, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Counter from "./ViewCounter";
import { faComputerMouse } from "@fortawesome/free-solid-svg-icons";
import { ViewIcon } from "@chakra-ui/icons";

export function SongPage() {
  const { searched } = useContext(SongContext);

  // 라우트 파라미터 'id'를 식별하기 위해 useParams 사용
  const { id } = useParams();

  // 컨텍스트에서 'id'를 기반으로 선택한 노래를 찾음
  const selectedSong = searched
    ? searched.find((song) => song.id === parseInt(id))
    : null;

  // 댓글 관련 state
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // 댓글 목록

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/song/${id}`);
      } catch (error) {
        console.error("에러 발생 : ", error);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // 새로운 댓글 추가
    setComments([...comments, comment]);
    // 댓글 입력창 초기화
    setComment("");
  };

  if (!selectedSong) {
    // 노래를 찾지 못한 경우
    return <Box>죄송합니다. 노래 세부 정보를 불러올 수 없습니다.</Box>;
  }

  return (
    <Box mt={"100px"}>
      <Flex>
        <Heading fontSize={"30px"}>
          {/* 어떤 아이콘이 더 나은가..?!*/}
          <FontAwesomeIcon
            icon={faComputerMouse}
            style={{ color: "#e3c7ff" }}
          />
          <ViewIcon color={"#e3c7ff"} />
          <Counter />
        </Heading>
      </Flex>
      <Flex>
        {/* 노래 사진 */}
        <Box mr={8}>
          <Image
            src={selectedSong.image}
            alt={`${selectedSong.artistName} - ${selectedSong.title}`}
            boxSize="400px"
            objectFit="cover"
          />
        </Box>

        {/* 노래 정보 입력 폼 */}
        <Box>
          <Heading fontSize="30px" color="purple">
            {selectedSong.title}
          </Heading>
          <Box mt={4}>
            <Flex>
              <FormLabel>가수</FormLabel>
              <div>{selectedSong?.artistName || ""}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>앨범명</FormLabel>
              <div>{selectedSong.album} </div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>Spotify</FormLabel>
              <div>{selectedSong.spotifyLink} </div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>Youtube</FormLabel>
              <div>{selectedSong.youtubeLink}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <Flex>
              <FormLabel>mood</FormLabel>
              <div>{selectedSong.mood}</div>
            </Flex>
          </Box>
          <Box mt={4}>
            <FormLabel>가사</FormLabel>
            <Textarea value={selectedSong.lyrics} isReadOnly />
          </Box>
        </Box>
      </Flex>

      {/* 댓글 작성 부분 */}
      <Box mt={8}>
        <Heading fontSize="30px">댓글</Heading>
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 작성하세요."
          size="lg"
          mt={4}
        />
        <Button
          colorScheme="purple"
          size="md"
          mt={4}
          onClick={handleCommentSubmit}
        >
          댓글 작성
        </Button>

        {/* 댓글 목록 표시 */}
        <Box mt={4}>
          <Heading fontSize="20px">댓글 목록</Heading>
          {comments.map((comment, index) => (
            <Box key={index} mt={2}>
              {comment}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default SongPage;
