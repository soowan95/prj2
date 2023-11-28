import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MemberLogin } from "../MemberLogin";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Button colorScheme="purple" mr={5} onClick={() => navigate("/")}>
        MAIN
      </Button>
      <MemberLogin />
    </Flex>
  );
}

export default NavBar;
