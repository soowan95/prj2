import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box>
      <NavBar />
      <Outlet />
    </Box>
  );
}
