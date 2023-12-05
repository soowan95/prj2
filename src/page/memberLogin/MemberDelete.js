import React, {useContext, useEffect} from 'react';
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Flex,
    Heading,
    Highlight,
    useToast
} from "@chakra-ui/react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {LoginContext} from "../../component/LoginProvider";

export function MemberDelete() {
    const toast = useToast();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const {fetchLogin, login} = useContext(LoginContext);

    useEffect(() => {
        fetchLogin();
    }, []);



    function handleMemberDelete() {
        // axios
        // delete /api/member?id=userid
        // ok -> home 이동, toast 띄우기
        // error -> toast 띄우기
        // finally -> modal 닫기
        axios.delete("/api/member?" + params.toString())
            .then(() => {
                toast({
                    description: "탈퇴 처리 되었습니다.",
                    status: "warning"
                })
            })
            .catch((error) => {
                if (error.response.status === 401 || error.response.status === 403) {
                    toast({
                        description: "권한이 없습니다",
                        status: "error"
                    })
                } else {
                    toast({
                        description: "탈퇴중에 문제가 발생하였습니다",
                        status: "error"
                    })
                }
            })

    }



    return (
        <Center mt={50}>
            <Card mt={50} w="2xl" h="2xl">
                <CardHeader>
                    <Heading>{login.nickName} 님</Heading>
                </CardHeader>
                <CardBody style={{textAlign: "center"}}>
                    <Center>
                        <Card w="xl" h="lg">
                            <CardHeader fontSize="2rem" textDecoration="bold">
                                <Highlight query='삭제' styles={{ px: '1', py: '1', bg: 'orange.100' }}>
                                    탈퇴시 모든 정보가 삭제됩니다.
                                </Highlight>
                            </CardHeader>
                        </Card>
                    </Center>
                </CardBody>
            </Card>
        </Center>
    )
}




export default MemberDelete;