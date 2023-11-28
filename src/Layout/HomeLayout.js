import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import {NavBar} from "../Component/NavBar";
import {MyPlayList} from "../Component/MyPlayList";

export function HomeLayout() {
  return (
    <Box mx={{ base: 0, md: 10, lg: 40 }} mb={80}>
      <NavBar />
      <Outlet />
    </Box>
  );
}
