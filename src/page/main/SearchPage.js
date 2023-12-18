import { useNavigate } from "react-router-dom";
import {useContext, useEffect} from "react";
import {SongContext} from "../../layout/MainLayout";
import {Box, Flex, FormControl, FormLabel} from "@chakra-ui/react";
import SongRequestComp from "../../component/SongRequestComp";
import axios from "axios";
import LiveChatComp from "../../component/LiveChatComp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlay, faFileLines} from "@fortawesome/free-regular-svg-icons";

export function SearchPage() {
  const { searched } = useContext(SongContext);
  const navigate = useNavigate(); // 페이지 이동

  // 노래 상세 페이지로 이동하는 함수
  const goToSongPage = (songId) => {
    axios.put("/api/song/plusSongPoint", {id:songId})
      .then(() => console.log("ok"))
    navigate(`/main/song/${songId}`);
  };

  // 새로고침 방지 변수
  const preventClose = (e:BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }

  // 페이지 로딩 시 새로고침 방지
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  },[]);


  return (
    <Box mt={"100px"}>
      {searched !== null &&
        searched.map((song) => (
          <Flex
            key={song.id}
            m={"3px auto"}
            width={"70%"}
            justifyContent={"center"}
            alignItems={"center"}
            borderBottom={"1px solid lavender"}
            _hover={{ bg: "grey" }}
            // Box를 클릭하면 해당 노래의 상세 페이지로 이동
            onClick={() => goToSongPage(song.id)}
          >
            <FormControl w={"300px"}>
              <FormLabel fontSize={17} color={"#535353"} cursor={"pointer"}>
                <FontAwesomeIcon icon={faFileLines} />　{song.title}
              </FormLabel>
              <FormLabel fontSize={15} cursor={"pointer"}>
                {song.artistName}
              </FormLabel>
            </FormControl>
            <Box w={"20%"}>{song.genre}</Box>
            <Box w={"20%"}>{song.mood}</Box>


            {/*<Box w={"22%"}>{song.title}</Box>*/}
            {/*<Box w={"22%"}>{song.artistName}</Box>*/}
            {/*<Box w={"22%"}>{song.genre}</Box>*/}
            {/*<Box w={"22%"}>{song.mood}</Box>*/}
          </Flex>
        ))}
      {searched !== null && searched.length === 0 && <SongRequestComp />}
    </Box>
  );
}
