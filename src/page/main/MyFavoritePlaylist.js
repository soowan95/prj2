import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function MyFavoritePlaylist() {
  const { login } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);

  useEffect(() => {
    params.set("id", login.id);
    axios
      .get("/api/myList/favorite?" + params.toString())
      .then((response) => setList(response.data));
  }, []);

  return (
    <Box mt={30}>
      <Heading>{login.nickName} 님의 취향저격 플레이리스트</Heading>
      <Divider />
      <Flex gap={5}>
        {list !== null &&
          list.map((song) => (
            <Box gap={5} key={song?.id}>
              <Box mt={30}>
                <Card w="xs">
                  <CardHeader _hover={{ cursor: "pointer" }}>
                    <Image src="https://pics.craiyon.com/2023-07-21/5e99d5b0b25c43fb90d62633f33f1a41.webp" />
                  </CardHeader>
                  <CardBody>
                    <Heading
                      size="md"
                      _hover={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {song?.listName}
                    </Heading>
                  </CardBody>
                  <Divider color="gray" />
                  <CardFooter>
                    <FontAwesomeIcon icon={faRecordVinyl} />
                    <Text>%곡</Text>
                    <Spacer />
                    <Text>생성자 : {song?.memberId} 님</Text>
                  </CardFooter>
                </Card>
              </Box>
            </Box>
          ))}
      </Flex>
    </Box>
  );
}

export default MyFavoritePlaylist;
