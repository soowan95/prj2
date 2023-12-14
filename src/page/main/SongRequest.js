import React, { useContext, useEffect, useRef, useState } from "react";
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
import { LoginContext } from "../../component/LoginProvider";

export function SongRequest() {
  const [requestList, setRequestList] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [genreList, setGenreList] = useState(null);
  const [moodList, setMoodList] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const artistName = useRef("");
  const songTitle = useRef("");
  const artist = useRef("");
  const title = useRef("");
  const group = useRef("");
  const album = useRef("");
  const release = useRef("");
  const lyric = useRef("");
  const songUrl = useRef("");

  const toast = useToast();
  const navigate = useNavigate();

  const [selectGenre, updateSelectGenre] = useImmer([]);
  const [selectMood, updateSelectMood] = useImmer([]);

  const { fetchLogin, isAuthenticated, disConnect, isAdmin } =
    useContext(LoginContext);

  // 파일 업로드
  const [files, setFiles] = useState(null);

  useEffect(() => {
    setIsUpdate(false);
    axios.get("/api/song/requestList").then((response) => {
      setRequestList(response.data);
    });
    axios.get("/api/song/genre").then(({ data }) => setGenreList(data));
    axios.get("/api/song/mood").then(({ data }) => setMoodList(data));
  }, [isUpdate]);

  function handleInsert() {
    // ok -> 성공 토스트 띄우면서 모달 닫기
    // error -> 오류 토스트 띄우면서 그대로 있기
    if (files) {
      axios
        .postForm("/api/song/insert", {
          title: title.current,
          artistName: artist.current,
          mood: selectMood.join(", "),
          genre: selectGenre.join(", "),
          artistGroup: group.current,
          album: album.current,
          release: release.current,
          lyric: lyric.current,
          requestTitle: songTitle.current,
          requestArtist: artistName.current,
          songUrl: songUrl.current,
          files: files,
        })
        .then(() => {
          toast({
            description: "저장이 완료 되었습니다☺️",
            status: "success",
          });
          setIsUpdate(true);
          onClose();
          updateSelectGenre((draft) => {
            draft.splice(0, draft.length);
          });
          updateSelectMood((draft) => {
            draft.splice(0, draft.length);
          });
        })
        .catch((error) => {
          toast({
            description: "저장 중 문제가 발생하였습니다😥",
            status: "warning",
          });
        });
    } else {
      axios
        .post("/api/song/insertOnlyInfo", {
          title: title.current,
          artistName: artist.current,
          mood: selectMood.join(", "),
          genre: selectGenre.join(", "),
          artistGroup: group.current,
          album: album.current,
          release: release.current,
          lyric: lyric.current,
          requestTitle: songTitle.current,
          requestArtist: artistName.current,
          songUrl: songUrl.current,
        })
        .then(() => {
          toast({
            description: "저장이 완료 되었습니다☺️",
            status: "success",
          });
          setIsUpdate(true);
          onClose();
          updateSelectGenre((draft) => {
            draft.splice(0, draft.length);
          });
          updateSelectMood((draft) => {
            draft.splice(0, draft.length);
          });
        })
        .catch((error) => {
          toast({
            description: "저장 중 문제가 발생하였습니다😥",
            status: "warning",
          });
        });
    }
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

  if (!isAdmin()) {
    navigate(-1);
    return null;
  }

  return (
    <Box>
      <Heading size={"md"} marginLeft={"30px"} marginTop={"50px"}>
        요청 목록
      </Heading>
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
              requestList
                .filter((a) => !a.updated)
                .map((request) => (
                  <Tr key={request.id}>
                    <Td>{request.member}</Td>
                    <Td>{request.artist}</Td>
                    <Td>{request.title}</Td>
                    <Td>
                      <Button
                        onClick={() => {
                          artistName.current = request.artist;
                          songTitle.current = request.title;
                          title.current = request.title;
                          artist.current = request.artist;
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
                onChange={(e) => (artist.current = e.target.value)}
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>그룹명</FormLabel>
              <Input onChange={(e) => (group.current = e.target.value)} />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>노래 제목</FormLabel>
              <Input
                defaultValue={songTitle.current}
                onChange={(e) => (title.current = e.target.value)}
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>앨범</FormLabel>
              <Input onChange={(e) => (album.current = e.target.value)} />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>출시일</FormLabel>
              <Input
                type="datetime-local"
                onChange={(e) => (release.current = e.target.value)}
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>가사</FormLabel>
              <Textarea onChange={(e) => (lyric.current = e.target.value)} />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>사진</FormLabel>
              {/* 사진 인풋 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ */}
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files[0])}
              />
            </FormControl>

            <FormControl mb={10}>
              <FormLabel fontWeight={"bold"}>노래 URL</FormLabel>
              <Input
                type="url"
                onChange={(e) => (songUrl.current = e.target.value)}
              />
            </FormControl>

            <hr />

            <FormControl mt={10} fontWeight={"bold"}>
              <Select
                mb={2}
                onChange={(e) => {
                  handleGenre(e.target.value);
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
