import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import NavBar from "../component/NavBar";
import "../css/Home.css";

export function HomeLayout() {
  return (
    <Box
      m={0}
      width={"100%"}
      height={"1000px"}
      style={{ backgroundSize: "100%" }}
      bgImg="https://t3.ftcdn.net/jpg/02/98/47/38/360_F_298473896_Vsz21xTwMtroEeeGgU8pL2vwt3N65pfR.jpg"
    >
      <NavBar />
      <Outlet />
    </Box>
  );
}
