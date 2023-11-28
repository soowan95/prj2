import React, {useContext, useEffect, useState} from 'react';
import {Button, Flex, Input, Spacer,} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {LoginModal} from "../Member/LoginModal";
import {LoginContext} from "./LoginProvider";
import {useLocation, useNavigate} from "react-router-dom";
import {MyInfo} from "./MyInfo";

export function NavBar() {
  const [search, setSearch] = useState("");
  const {fetchLogin, login, isAuthenticated} = useContext(LoginContext);
  const location = useLocation();
  const urlParams = new URLSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }


  return (
    <Flex
      gap={5}
      mt={10}
    >
      <Button
        variant="ghost"
        size="lg">
        <FontAwesomeIcon icon={faBars}/>
      </Button>
      <Button onClick={()=>console.log("RELIEVE")}>
        RELIEVE
      </Button>
      <Input width="650px" value={search} placeholder="Search" onChange={(e)=>setSearch(e.target.value)}/>
      <Button
        variant="ghost"
        leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
      <Spacer/>
      {isAuthenticated() || (
        <LoginModal />
      )}
      {isAuthenticated() && (
        <MyInfo />
      )}

    </Flex>
  );
}