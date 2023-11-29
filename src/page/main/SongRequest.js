import React, { useState } from "react";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

export function SongRequest() {
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [requestor, setRequestor] = useState("");

  function handleSubmit() {
    axios
      .get("/api/song/requestlist", {
        songTitle,
        artist,
        requestor,
      })
      .then(() => console.log("잘됨"))
      .catch(() => console.log("안됨"))
      .finally(() => console.log("끝"));
  }

  return (
    <Center>
      <h2>요청 곡</h2>
      <FormControl>
        <FormLabel>노래 제목</FormLabel>
        <Input
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>가수</FormLabel>
        <Input value={artist} onChange={(e) => setArtist(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>요청자</FormLabel>
        <Input
          value={requestor}
          onChange={(e) => setRequestor(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleSubmit}>정보입력</Button>
    </Center>
  );
}

export default SongRequest;
