import React, { useContext } from "react";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MemberLogin } from "../MemberLogin";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { LoginContext } from "../App";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated } = useContext(LoginContext);

  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다🙂",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button colorScheme="purple" mr={5} onClick={() => navigate("/")}>
        MAIN
      </Button>
      <MemberLogin />

      {isAuthenticated() && (
        <Button colorScheme="purple" onClick={handleLogout}>
          로그아웃
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
      )}
    </Flex>
  );
}

export default NavBar;
