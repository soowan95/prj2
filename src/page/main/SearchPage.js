import { useNavigate } from "react-router-dom";
import {useContext, useEffect} from "react";
import {SongContext} from "../../layout/MainLayout";
import {Box, Flex} from "@chakra-ui/react";
import SongRequestComp from "../../component/SongRequestComp";
import axios from "axios";

export function SearchPage() {
  const { searched } = useContext(SongContext);
  const navigate = useNavigate(); // 페이지 이동

  // 노래 상세 페이지로 이동하는 함수



  const goToSongPage = (songId) => {
    axios.put("/api/song/plusSongPoint", {id:songId}).then(() => console.log("ok"))
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
            justifyContent={"space-between"}
            border={"1px solid black"}
            // Box를 클릭하면 해당 노래의 상세 페이지로 이동
            onClick={() => goToSongPage(song.id)}
            style={{ cursor: "pointer" }}
          >
            <Box>{song.title}</Box>
            <Box>{song.artistName}</Box>
            <Box>{song.genre}</Box>
            <Box>{song.mood}</Box>
          </Flex>
        ))}
      {searched !== null && searched.length === 0 && <SongRequestComp />}
    </Box>
  );
}
