import React, {useContext, useEffect, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Spacer,
  Text, Tooltip, useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as fullHeart, faRecordVinyl} from "@fortawesome/free-solid-svg-icons";
import {LoginContext} from "../../component/LoginProvider";
import {faHeart} from "@fortawesome/free-regular-svg-icons";

export function MyPlayList() {
    const navigate = useNavigate();
    const [list, setList] = useState(null);

    const {login} = useContext(LoginContext);
    const location = useLocation();


    useEffect(() => {
        const params = new URLSearchParams();
        params.set("id", login.id);
        axios.get("/api/myList/get?" + params).then(({data}) => setList(data));
    }, [location]);



    function handleLike(listId) {
      axios.post("/api/like", {memberId: login.id, listId})
        .then((response)=> console.log(response.data))
        .catch((error)=>console.log(error.data))
    }

    return (
        <>
            <Divider/>
            <Heading ml={10}>{login.nickName} 님의 재생목록</Heading>
            <Divider/>
            <Flex gap={5}>
                {list !== null &&
                    list.map((song) => (
                        <Box gap={5} key={song?.id}>
                            <Box mt={30}>
                                <Card w="xs">
                                    <CardHeader
                                        _hover={{cursor: "pointer"}}
                                    >
                                        <Image
                                            src="https://cdn.dribbble.com/users/5783048/screenshots/13902636/skull_doodle_4x.jpg"/>
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
                                    <Divider color="gray"/>
                                    <CardFooter>
                                        <FontAwesomeIcon icon={faRecordVinyl}/>
                                        <Text>$곡</Text>
                                        <Spacer/>
                                        <Button leftIcon={<FontAwesomeIcon icon={faHeart} />}
                                        onClick={() => handleLike(song.id)}
                                        >
                                          좋아요갯수
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Box>
                        </Box>
                    ))}
            </Flex>
        </>
    );
}
