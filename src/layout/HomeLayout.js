import { Box, Image } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import NavBar from "../component/NavBar";
import "../css/Home.css";

export function HomeLayout() {
  return (
    <Box
      mt={"-40px"}
      p={0}
      boxSizing="border-box"
      width={"100%"}
      height={"950px"}
      style={{ backgroundSize: "100%" }}
      bgImg="https://t3.ftcdn.net/jpg/02/98/47/38/360_F_298473896_Vsz21xTwMtroEeeGgU8pL2vwt3N65pfR.jpg"
    >
      <Box
        position={"relative"}
        left={"50%"}
        transform={"translate(-50%, 50%)"}
        width={"545px"}
        height={"458px"}
        bgImage={`url(${process.env.PUBLIC_URL}/img/RelieveWhiteMain.png)`}
        backgroundSize={"100%"}
        mb={"-300px"}
      />
      <NavBar />
      <Outlet />
    </Box>
  );
}
