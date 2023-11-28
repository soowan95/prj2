import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {
  Button, Center, Input,

  useDisclosure, useToast, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {SignUp} from "./SignUp";

export function LoginModal() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const {isOpen, onClose, onOpen} = useDisclosure();
  const toast = useToast();

  function handleLogin() {
    axios.post("/api/member/login", {id, password})
      .then(() => {
        toast({
          description: "Login Success",
          status: "success"
        })

        onClose();
        window.location.reload(0);
      })
      .catch(() => {
        toast({
          description: "Login Error",
          status: "error"
        })
        onClose();
      })

  }

  return (
    <>
      <Button
        variant="ghost"
        size="lg"
        borderRadius={50}
        onClick={onOpen}
      >
        <FontAwesomeIcon icon={faUser}/>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>LOGIN</ModalHeader>
          <ModalCloseButton/>
          <FontAwesomeIcon icon={faUser} size="8x"/>
          <ModalBody>
            <Center>ID</Center>
            <Input value={id} onChange={(e) => setId(e.target.value)}/>
            <Center>PASSWORD</Center>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </ModalBody>
          <ModalFooter>
            <Button w="100%" colorScheme="facebook" onClick={handleLogin}>
              LOGIN
            </Button>

          </ModalFooter>
          <ModalFooter>
            <SignUp/>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>)
}
