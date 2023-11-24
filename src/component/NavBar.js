import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>MAIN</Button>
      <Button onClick={() => navigate("/login")}>로그인</Button>
    </Flex>
  );
}

export default NavBar;
