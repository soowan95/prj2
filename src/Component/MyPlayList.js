import React, {useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Heading,
  Image,
  Spacer, Text
} from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRecordVinyl} from "@fortawesome/free-solid-svg-icons";
import {LoginContext} from "./LoginProvider";


export function MyPlayList() {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const params = new URLSearchParams();

  const {login} = useContext(LoginContext);

  params.set("listId", login.id);


  useEffect(() => {
    axios.get("/api/myList/get?"+params)
      .then(({data}) => setList(data))

  }, []);

  return (
    <>
      <Divider/>
      {list !== null && list.map(song => (
        <Box key={song.id}>
          <Box>
            {song.listId} 님의 재생목록
          </Box>
          <Box mt={30}>
              <Card w="sm">
                <CardHeader _hover={{cursor: "pointer"}}>
                  <Image src="https://cdn.dribbble.com/users/5783048/screenshots/13902636/skull_doodle_4x.jpg"/>
                </CardHeader>
                <CardBody>
                  <Heading size="md">{song.listName}</Heading>
                </CardBody>
                <Divider color="gray"/>
                <CardFooter>
                  <FontAwesomeIcon icon={faRecordVinyl}/>
                  <Text>$곡</Text>
                  <Spacer/>
                  <Text>생성일 : </Text>
                </CardFooter>
              </Card>
          </Box>
        </Box>

      ))}
    </>
  )
}

