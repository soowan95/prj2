import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { SongContext } from "../../layout/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PlayComp from "../../component/PlayComp";
import KakaoShareComp from "../../component/KakaoShareComp";

export function Top100Page() {
  const [similar, setSimilar] = useState(null);
  const [songIndex, setSongIndex] = useState(0);

  const { top100 } = useContext(SongContext);

  const thisId = useRef(0);

  const songDrawer = useDisclosure();

  const params = new URLSearchParams();

  const navigate = useNavigate();

  function handleSimilarButton(genre, mood, id) {
    params.set("genre", genre);
    params.set("mood", mood);
    params.set("id", id);

    if (thisId.current === id) {
      thisId.current = 0;
      setSimilar(null);
    } else {
      thisId.current = id;

      axios.get("/api/song/similar?" + params).then(({ data }) => {
        setSimilar(data);
      });
    }
  }

  return (
    <Box mt={"100px"}>
      {top100 !== null &&
        top100.map((song) => (
          <Box
            key={song.id}
            m={"3px auto"}
            width={"70%"}
            border={"1px solid black"}
            style={{ cursor: "pointer" }}
          >
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
            >
              <Box
                onClick={() => {
                  setSongIndex(song.indexForPlay);
                  songDrawer.onOpen();
                }}
                w={"20%"}
              >
                {song.title}
              </Box>
              <Box w={"20%"}>{song.artistName}</Box>
              <Box w={"20%"}>{song.genre}</Box>
              <Box w={"20%"}>{song.mood}</Box>
              <Box
                w={"15%"}
                textAlign={"right"}
                onClick={() =>
                  handleSimilarButton(song.genre, song.mood, song.id)
                }
              >
                <FontAwesomeIcon fontSize={"0.8rem"} icon={faClone} />
              </Box>
            </Flex>
            {similar !== null &&
              song.id === thisId.current &&
              similar.map((si) => (
                <Flex
                  key={si.id}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"90%"}
                  m={"0 auto"}
                >
                  <Box w={"20%"}>{si.title}</Box>
                  <Box w={"20%"}>{si.artistName}</Box>
                  <Box w={"20%"}>{si.genre}</Box>
                  <Box w={"20%"}>{si.mood}</Box>
                </Flex>
              ))}
          </Box>
        ))}
      <PlayComp
        index={songIndex}
        setIndex={setSongIndex}
        isOpen={songDrawer.isOpen}
        onClose={songDrawer.onClose}
        songList={top100}
      />
    </Box>
  );
}
