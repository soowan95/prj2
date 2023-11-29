import { useContext } from "react";
import { SongContext } from "../../layout/MainLayout";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function SearchPage() {
  const { searched } = useContext(SongContext);
  const navigate = useNavigate(); // 페이지 이동

  // 노래 상세 페이지로 이동하는 함수
  const goToSongPage = (songId) => {
    navigate(`/main/song/${songId}`);
  };

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
    </Box>
  );
}
