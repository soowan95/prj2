import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

export function SongRequest() {
  const [requestList, setRequestList] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const [genre, setGenre] = useState(null);
  const [genreList, setGenreList] = useState(null);
  const [mood, setMood] = useState(null);
  const [moodList, setMoodList] = useState(null);

  const artistName = useRef("");
  const songTitle = useRef("");

  const toast = useToast();
  const navigate = useNavigate();

  const [selectGenre, updateSelectGenre] = useImmer([]);
  const [selectMood, updateSelectMood] = useImmer([]);

  // 파일 업로드
  const [file, setFile] = useState(null);



  useEffect(() => {
    axios.get("/api/song/requestList").then((response) => {
      setRequestList(response.data);
    });
    axios.get("/api/song/genre").then(({ data }) => setGenreList(data));
    axios.get("/api/song/mood").then(({ data }) => setMoodList(data));
  }, []);

  function handleInsert() {
    // ok -> 성공 토스트 띄우면서 모달 닫기
    // error -> 오류 토스트 띄우면서 그대로 있기
    axios
      .postForm("/api/song/insert",{file})
      .then(() => {
        toast({
          description: "저장이 완료 되었습니다☺️",
          status: "success",
        });
        onClose();
      })
      .catch((error) => {
        toast({
          description: "저장 중 문제가 발생하였습니다😥",
          status: "warning",
        });
      });
  }

  function handleGenre(e) {
    if (e !== "") {
      updateSelectGenre((draft) => {
        // 중복 체크 후 중복된 항목이 있다면 제거
        const index = draft.indexOf(e);
        if (index === -1) {
          draft.push(e);
        } else {
          draft.splice(index, 1);
        }
      });
    }
  }

  function handleMood(e) {
    if (e !== "") {
      updateSelectMood((draft) => {
        // 중복 체크 후 중복된 항목이 있다면 제거
        const index = draft.indexOf(e);
        if (index === -1) {
          draft.push(e);
        } else {
          draft.splice(index, 1);
        }
      });
    }
  }

  return (
    <Box>
      <Heading size={"md"}>요청 목록</Heading>
      <br />
      <br />

      <Box>
        <Table>
          <Thead>
            <Tr>
              {/* TODO: 수정 예정 */}
              <Th w={"200px"}>요청자 ID</Th>
              <Th>가수</Th>
              <Th>노래 제목</Th>
            </Tr>
          </Thead>

          <Tbody>
            {requestList !== null &&
              requestList.map((request) => (
                <Tr>
                  <Td>{request.member}</Td>
                  <Td>{request.artist}</Td>
                  <Td>{request.title}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        artistName.current = request.artist;
                        songTitle.current = request.title;
                        onOpen();
                      }}
                      colorScheme="purple"
                      size={"sm"}
                    >
                      입력
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* 입력 창 모달 ! */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"small"}>입력 확인 ✅</ModalHeader>
          <ModalCloseButton />
          <ModalBody mt={5}>
            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>가수명</FormLabel>
              <Input
                defaultValue={artistName.current}
                onChange={(e) => setArtist(e.target.value)}
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>그룹명</FormLabel>
              <Input />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>노래 제목</FormLabel>
              <Input
                defaultValue={songTitle.current}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>앨범</FormLabel>
              <Input />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>출시일</FormLabel>
              <Input type="date" />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>가사</FormLabel>
              <Textarea />
            </FormControl>

            <FormControl mb={10}>
              <FormLabel fontWeight={"bold"}>사진</FormLabel>

              <Input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
            </FormControl>

            <hr />

            <FormControl mt={10} fontWeight={"bold"}>
              <Select
                mb={2}
                onChange={(e) => {
                  handleGenre(e.target.value);
                  setGenre(e.target.value);
                }}
                placeholder="장르를 선택하세요."
              >
                {/*<option disabled>장르를 선택하세요</option>*/}
                {genreList !== null &&
                  genreList.map((genreList) => (
                    <option value={genreList.genre}>{genreList.genre}</option>
                  ))}
              </Select>
              <Text color={"indianred"} mb={9}>
                선택하신 장르는 {selectGenre.join(", ")} 입니다.
              </Text>

              <Select
                mb={2}
                onChange={(e) => {
                  handleMood(e.target.value);
                  setMood(e.target.value);
                }}
                placeholder="무드를 선택하세요."
              >
                {/*<option>무드를 선택하세요</option>*/}
                {moodList !== null &&
                  moodList.map((moodList) => (
                    <option value={moodList.mainMood}>
                      {moodList.mainMood}
                    </option>
                  ))}
              </Select>
              <Text color={"indianred"}>
                선택하신 무드는 {selectMood.join(", ")} 입니다.
              </Text>
            </FormControl>
            <br />
          </ModalBody>

          <ModalFooter>
            <Box fontWeight={"bold"} fontSize={"large"}>
              입력 하시겠습니까? 😉　　　　　　　
            </Box>
            <Button onClick={handleInsert} colorScheme="purple" mr={3}>
              저장
            </Button>
            <Button onClick={onClose} background={"lightblue"}>
              닫기
            </Button>
          </ModalFooter>
          <br />
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SongRequest;
