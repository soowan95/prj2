import React from "react";
import { Box, Center } from "@chakra-ui/react";
import { MemberLogin } from "../page/memberLogin/MemberLogin";

export function NavBar() {
  return (
    <>
      <Box mt={10}>
        <Center>
          <MemberLogin />
        </Center>
      </Box>
    </>
  );
}

export default NavBar;
