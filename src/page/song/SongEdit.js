import { Box, Input, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import axios from "axios";
import SongRequest from "../main/SongRequest";

export function SongEdit() {
  const [song, updateSong] = useImmer(null);
  // /songEdit/:id
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/song/songEdit/" + id)
      .then((response) => updateSong(response.data));
  }, [id, updateSong]);

  return (
    <Box>
      <Box>
        <Input type="file" />
      </Box>
    </Box>
  );
}
