import { useContext } from "react";
import { SongContext } from "./MainLayout";
import { Box, Flex } from "@chakra-ui/react";

export function SearchPage() {
  const { searched } = useContext(SongContext);

  return (
    <Box mt={"100px"}>
      {searched !== null &&
        searched.map((song) => (
          <Flex
            key={song.id}
            m={"3px auto"}
            width={"60%"}
            justifyContent={"space-between"}
            border={"1px solid black"}
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
