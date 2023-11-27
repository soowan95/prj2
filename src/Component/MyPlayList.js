import React from 'react';
import {Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Divider, Heading, Spacer} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRecordVinyl} from "@fortawesome/free-solid-svg-icons";




export function MyPlayList() {

  return (
    <Button _hover={{cursor : "pointer", textDecoration : "underline"}} onClick={handlePlaylist}>MyPlaylist</Button>
  )
}

