import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Flex,
    Heading, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {LoginContext} from "../../component/LoginProvider";
import axios from "axios";
import PasswordRecovery from "./PasswordRecovery";


export function MemberInfo() {
    const {fetchLogin, login} = useContext(LoginContext);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [nickName, setNickName] = useState("");
    const [email, setEmail] = useState("");
    const [nickNameAvailable, setNickNameAvailable] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchLogin();
    }, []);

    function handleNickNameCheck() {
        const params = new URLSearchParams();
        params.set("nickName", nickName);

        axios.get("/api/member/check?"+params)
            .then(()=>{
                setNickNameAvailable(true);
                toast({
                    description:"이미 사용중인 닉네임입니다.",
                    status:"warning"
                });
            })
            .catch((error)=> {
                if (error.response.status === 404) {
                    toast({
                        description:"사용 가능한 별명입니다.",
                        status:"success"
                    });
                }
            })

    }

    function handleEmailCheck() {
        const params = new URLSearchParams();
        params.set("email", email);

        axios.get("/api/member/check?"+params)
            .then(()=>{
                toast({
                    description:"이미 사용중인 email입니다.",
                    status:"warning"
                });
            })
            .catch((error)=>{
                if (error.response.status === 404) {
                    setEmailAvailable(true);
                    toast({
                        description:"사용 가능한 email입니다.",
                        status:"success"
                    });
                }
            })
    }


    function handlePassword() {
        return (<PasswordRecovery />);
    }





    return (
        <Center mt={50}>
            <Card mt={50} w="2xl" h="2xl">
                <CardHeader>
                    <Heading>member info</Heading>
                </CardHeader>
                <CardBody style={{textAlign: "center"}}>
                    <Flex gap={5}>
                        <Card w="sm" h="250px">
                            <CardBody mt={50}>
                                나의 정보를 수정합니다.
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme="facebook" onClick={onOpen}>개인정보 수정</Button>
                            </CardFooter>
                        </Card>
                        <Card w="sm" h="250px">
                            <CardBody mt={50}>
                                내가 좋아하는 플레이리스트
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme="facebook">
                                    좋아요 표시한 플레이리스트
                                </Button>
                            </CardFooter>
                        </Card>
                    </Flex>
                    <br/>
                    <Flex gap={5}>
                        <Card w="sm" h="250px">
                            <CardBody mt={50}>
                                내가 좋아하는 음악
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme="facebook">좋아요 표시한 음악</Button>
                            </CardFooter>
                        </Card>
                        <Card w="sm" h="250px">
                            <CardBody mt={50}>
                                RELIEVE 회원을 탈퇴합니다.
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme="facebook">회원탈퇴</Button>
                            </CardFooter>
                        </Card>
                    </Flex>
                </CardBody>
            </Card>


            {/* 비밀번호 수정 모달 */}







            {/* 개인정보 수정 모달 */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>개인정보 수정</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        아이디
                        <Input type="text" value={login.id} readOnly color="gray"/>
                        <br/>
                        닉네임
                        <Flex gap={3}>
                            <Input type="text" value={nickName} onChange={(e)=> {setNickName(e.target.value); setNickNameAvailable(false);}} />
                            <Button variant="ghost" onClick={handleNickNameCheck}>중복확인</Button>
                        </Flex>
                        이메일
                        <Flex gap={3}>
                            <Input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
                            <Button variant="ghost" onClick={handleEmailCheck}>중복확인</Button>
                        </Flex>
                        비밀번호 <br/>
                        <Button variant="ghost" colorScheme="whatsapp" onClick={handlePassword}>비밀번호 변경하기</Button>
                    </ModalBody>
                    <ModalFooter gap={5}>
                        <Button colorScheme="blue">
                            수정
                        </Button>
                        <Button colorScheme="red" onClick={onClose}>
                            취소
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    )
}

export default MemberInfo;