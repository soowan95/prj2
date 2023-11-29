import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import {
  faBasketballBall,
  faFloppyDisk,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SongContext } from "../../layout/MainLayout";

export function SongRequest() {
  const [requestList, setRequestList] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [memberId, setMemberId] = useState("");
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const [genre, setGenre] = useState(null);
  const [genreList, setGenreList] = useState(null);

  useEffect(() => {
    axios.get("/api/song/requestList").then((response) => {
      setRequestList(response.data);
      setGenreList(response.data);
    });
  }, []);

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
                    <Button onClick={onOpen} colorScheme="purple" size={"sm"}>
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
          <ModalBody mt={10}>
            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>요청ID</FormLabel>
              <Input
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </FormControl>
            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>가수</FormLabel>
              <Input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </FormControl>
            <FormControl mb={5}>
              <FormLabel fontWeight={"bold"}>노래 제목</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl fontWeight={"bold"}>
              장르　　　　　　　　　　　무드
              <Flex>
                <Select onChange={(e) => setGenre(e.target.value)} mr={3}>
                  {genreList.map((genreList) => (
                    <option>{genreList}</option>
                  ))}
                </Select>

                <Select>
                  <option></option>
                </Select>
              </Flex>
            </FormControl>
            <br />
          </ModalBody>

          <ModalFooter>
            <Box fontWeight={"bold"} fontSize={"large"}>
              입력 하시겠습니까? 😉　　　　　　
            </Box>
            <Button colorScheme="purple" mr={3}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </Button>
            <Button colorScheme="blue">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </ModalFooter>
          <br />
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SongRequest;
