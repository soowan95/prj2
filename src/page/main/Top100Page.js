import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { SongContext } from "../../layout/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faClone } from "@fortawesome/free-regular-svg-icons";
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
            m={"10px auto"}
            width={"75%"}
            alignItems={"center"}
            borderBottom={"1px solid lavender"}
            _hover={{ bg: "#818588", opacity: 0.6 }}
            // style={{ cursor: "pointer" }}
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
                h={"60px"}
                //border={"1px solid black"}
              >
                <FormControl w={"300px"}>
                  <FormLabel fontSize={17} color={"#F3DA2A"} cursor={"pointer"}>
                    <FontAwesomeIcon icon={faCirclePlay} /> {song.title}
                  </FormLabel>
                  <FormLabel fontSize={15} cursor={"pointer"}>
                    {song.artistName}
                  </FormLabel>
                </FormControl>
              </Box>

              {/*<Box w={"20%"}>{song.artistName}</Box>*/}

              <Box w={"20%"}>{song.genre}</Box>
              <Box w={"20%"}>{song.mood}</Box>
              <Box
                w={"15%"}
                textAlign={"right"}
                onClick={() =>
                  handleSimilarButton(song.genre, song.mood, song.id)
                }
              >
                <Tooltip label={"Similar Songs"}>
                  <FontAwesomeIcon
                    cursor={"pointer"}
                    fontSize={"0.8rem"}
                    icon={faClone}
                  />
                </Tooltip>
              </Box>
            </Flex>
            <Center>
              <Flex w={"80%"} justifyContent={"space-between"}>
                {similar !== null &&
                  song.id === thisId.current &&
                  similar.map((si) => (
                    <Box
                      //border={"1px black solid"}
                      key={si.id}
                      //alignItems={"center"}
                      m={"0 auto"}
                    >
                      <Card
                        w={"150px"}
                        bg={
                          localStorage.getItem("chakra-ui-color-mode") ===
                          "dark"
                            ? "#f3cd5d"
                            : "#e86db3"
                        }
                      >
                        <CardBody>
                          <Box fontWeight={"bold"} color={"#535353"}>
                            {si.title.length > 10
                              ? si.title.slice(0, 10) + ".."
                              : si.title}
                          </Box>
                          <Box>{si.artistName}</Box>
                          <Box>{si.genre}</Box>
                          <Box>{si.mood}</Box>
                        </CardBody>
                      </Card>
                    </Box>
                  ))}
              </Flex>
            </Center>
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
