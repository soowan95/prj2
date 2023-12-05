import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import NavBar from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box mx={{ base: 0, md: 10, lg: 40 }} mb={80}
         h="100vh"
    bgImg="https://img.freepik.com/free-photo/background-gradient-lights_23-2149304985.jpg">
      <NavBar />
      <Outlet />
    </Box>
  );
}
