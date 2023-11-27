import React from "react";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MemberLogin } from "../MemberLogin";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export function NavBar() {
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다🙂",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex>
      <Button colorScheme="purple" mr={5} onClick={() => navigate("/")}>
        MAIN
      </Button>
      <MemberLogin />

      <Button colorScheme="purple" onClick={handleLogout}>
        로그아웃　
        <FontAwesomeIcon icon={faRightFromBracket} />
      </Button>
    </Flex>
  );
}

export default NavBar;
