import { Box, Button } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { useState } from "react";

function PlayComp() {
  const [isPlay, setIsPlay] = useState(false);
  return (
    <Box>
      <Button onClick={() => setIsPlay(!isPlay)}>play</Button>
      <ReactPlayer
        playing={isPlay}
        url={
          "https://music.youtube.com/watch?v=aBCT3B6FGaY&si=Y_agZez2vgR8-cOU"
        }
      />
    </Box>
  );
}

export default PlayComp;
