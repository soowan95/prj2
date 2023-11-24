import { Box, Button, Flex } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { SongContext } from "./MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

export function Top100Page() {
  const [similar, setSimilar] = useState(null);

  const { top100 } = useContext(SongContext);

  const params = new URLSearchParams();

  function handleSimilarButton(genre, mood, id) {
    params.set("genre", genre);
    params.set("mood", mood);
    params.set("id", id);
    axios
      .get("/api/song/similar?" + params)
      .then(({ data }) => setSimilar(data));
  }

  return (
    <Box mt={"100px"}>
      {top100 !== null &&
        top100.map((song) => (
          <Flex
            key={song.id}
            m={"3px auto"}
            width={"60%"}
            justifyContent={"center"}
            border={"1px solid black"}
          >
            <Box>{song.title}</Box>
            <Box>{song.genre}</Box>
            <Box>{song.mood}</Box>
            <Button
              size={"s"}
              onClick={() =>
                handleSimilarButton(song.genre, song.mood, song.id)
              }
            >
              <FontAwesomeIcon fontSize={"0.8rem"} icon={faClone} />
            </Button>
            {similar !== null &&
              similar.map((si) => (
                <Flex
                  key={si.id}
                  m={"3px auto"}
                  width={"60%"}
                  justifyContent={"center"}
                  border={"1px solid black"}
                >
                  <Box>{si.title}</Box>
                  <Box>{si.genre}</Box>
                  <Box>{si.mood}</Box>
                </Flex>
              ))}
          </Flex>
        ))}
    </Box>
  );
}
