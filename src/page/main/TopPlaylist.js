import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  FormLabel,
  Heading,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import PlayComp from "../../component/PlayComp";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export function TopPlaylist() {
  const [params] = useSearchParams();
  const [playlistByListId, setPlaylistByListId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/myList/topPlaylist?listId=" + params.get("listId"))
      .then((response) => setPlaylistByListId(response.data));
  }, []);

  return (
    <Center mt={50}>
      <Box>
        <Flex flexDirection="row">
          <Box mr={8}>
            <Image
              src="https://image.genie.co.kr/Y/IMAGE/Playlist/Channel/GENIE/PLAYLIST_20231128121036.png/dims/resize/Q_80,0"
              boxSize="400px"
              objectFit="cover" // 이미지가 상자를 완전히 덮도록 크기 조절하는 것
            />
          </Box>
          <Box>
            <Heading fontSize="30px" color="black"></Heading>
            <Flex>
              <FormLabel>
                작성자 : {playlistByListId && playlistByListId.at(0).memberId}
              </FormLabel>
            </Flex>
            <Flex>
              <FormLabel>
                조회수 :{" "}
                {playlistByListId && playlistByListId.at(0).myplaylistcount}
              </FormLabel>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
}

export default TopPlaylist;
