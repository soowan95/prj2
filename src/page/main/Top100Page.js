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
import {useNavigate} from "react-router-dom";
import PlayComp from "../../component/PlayComp";

export function Top100Page() {
  const [similar, setSimilar] = useState(null);
  const [songIndex, setSongIndex] = useState(null);

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

  function handleSongClick(songId) {
    navigate(`/main/song/${songId}`);
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
            // hover 및 클릭 기능 추가
            style={{cursor: "pointer"}}
            onClick={() => handleSongClick(song.id)}
          >
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              <Box
                onClick={() => {
                  setSongIndex(song.indexForPlay);
                  songDrawer.onOpen();
                }}
              >
                {song.title}
              </Box>
              <Box>{song.artistName}</Box>
              <Box>{song.genre}</Box>
              <Box>{song.mood}</Box>
              <FontAwesomeIcon
                fontSize={"0.8rem"}
                icon={faClone}
                onClick={() =>
                  handleSimilarButton(song.genre, song.mood, song.id)
                }
              />
            </Flex>
            {similar !== null &&
              song.id === thisId.current &&
              similar.map((si) => (
                <Flex
                  key={si.id}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"90%"}
                  m={"0 auto"}
                >
                  <Box>{si.title}</Box>
                  <Box>{si.artistName}</Box>
                  <Box>{si.genre}</Box>
                  <Box>{si.mood}</Box>
                </Flex>
              ))}
          </Box>
        ))}
      <PlayComp
        index={songIndex}
        setIndex={setSongIndex}
        isOpen={songDrawer.isOpen}
        onClose={songDrawer.onClose}
        top100={top100}
      />
    </Box>
  );
}
