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
    Spacer, Table, Tbody, Td,
    Text, Th, Thead, Tr,
} from "@chakra-ui/react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRecordVinyl} from "@fortawesome/free-solid-svg-icons";
import {LoginContext} from "../../component/LoginProvider";
import ChartPage from "./ChartPage";

export function MyPlayList() {
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [songList, setSongList] = useState(null);


    const {login} = useContext(LoginContext);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("id", login.id);
        axios.get("/api/myList/get?" + params).then(({data}) => setList(data));
    }, [location]);


    function handleChart() {

        axios
            .get("/api/song/chartlist")
            .then(() => navigate("/main/chartpage"))

    }

    return (
        <>
            <Divider/>
            <Heading>{login.nickName} 님의 재생목록</Heading>
            <Divider/>
            <Flex gap={5}>
                {list !== null &&
                    list.map((song) => (
                        <Box gap={5} key={song?.id}>
                            <Box mt={30}>
                                <Card w="xs">
                                    <CardHeader
                                        _hover={{cursor: "pointer"}}
                                        onClick={handleChart}
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
                                            onClick={handleChart}
                                        >
                                            {song?.listName}
                                        </Heading>
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
            </Flex>
        </>
    );
}
