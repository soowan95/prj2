import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    FormControl, FormHelperText, FormLabel,
    Heading,
    Highlight, Input,
    useToast
} from "@chakra-ui/react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {LoginContext} from "../../component/LoginProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

export function MemberDelete() {
    const toast = useToast();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const {fetchLogin, login} = useContext(LoginContext);
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    useEffect(() => {
        fetchLogin();
    }, []);


    function handleMemberDelete() {
        // axios
        // delete /api/member?id=userid
        // ok -> home 이동, toast 띄우기
        // error -> toast 띄우기
        // finally -> modal 닫기

        axios.delete("/api/member?"+params.toString())
            .then(()=> {
                toast({
                    description:"탈퇴되었습니다.",
                    status:"info"
                })
                window.location.reload(0);
                navigate("/");
            })
            .catch((error)=> {
                if (error.response.status === 401 || error.response.status === 403) {
                    toast({
                        description:"권한이 없습니다",
                        status:"error"
                   })
                } else {
                    toast({
                        description:"탈퇴중 문제가 발생했습니다.",
                        status:"error"
                    });
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
                                <Highlight query='삭제' styles={{px: '1', py: '1', bg: 'orange.100'}}>
                                    탈퇴시 모든 정보가 삭제됩니다.
                                </Highlight>
                            </CardHeader>
                            <CardBody>
                                <FormControl>
                                    <FormLabel>
                                        탈퇴를 위해 비밀번호를 입력하세요
                                    </FormLabel>
                                    <Input type="password" value={password}
                                           onChange={(e) => setPassword(e.target.value)}/>
                                </FormControl>
                                {password.length > 0 &&  (
                                    <FormControl>
                                        <FormLabel>비밀번호를 재입력하세요</FormLabel>
                                        <Input type="password" value={passwordCheck}
                                               onChange={(e) => setPasswordCheck(e.target.value)}/>
                                        {password !== passwordCheck && (<FormHelperText color="red" fontSize="0.8rem"><FontAwesomeIcon icon={faCircleExclamation} /><br/>비밀번호가 일치하지 않습니다.</FormHelperText>)}
                                    </FormControl>
                                    )}
                            </CardBody>
                            <CardFooter gap={5}>

                                <Button colorScheme="red" isDisabled={password !== passwordCheck}
                                onClick={handleMemberDelete}>탈퇴</Button>
                                <Button colorScheme="blue">취소</Button>
                            </CardFooter>
                        </Card>
                    </Center>
                </CardBody>
            </Card>
        </Center>
    )
}


export default MemberDelete;