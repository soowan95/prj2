import {
  Box,
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { useRef, useState } from "react";
import {
  faBackward,
  faForward,
  faPlay,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdGraphicEq } from "react-icons/md";

function PlayComp({ top100, playerTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rerenderCount, setRerenderCount] = useState(0);

  const songInfo = useRef("");

  function format(seconds) {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    return `${mm}:${ss}`;
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  let timer;

  if (isPlaying) {
    timer = setInterval(() => {
      setRerenderCount((rerenderCount) => rerenderCount + 1);
    }, 100);
  } else {
    clearInterval(timer);
  }

  const currentTime =
    songInfo && songInfo.current ? songInfo.current.getCurrentTime() : "00:00";

  const duration =
    songInfo && songInfo.current ? songInfo.current.getDuration() : "00:00";

  const elapsedTime = format(currentTime);

  const totalDuration = format(duration);

  function handleRewind() {
    songInfo.current.seekTo(songInfo.current.getCurrentTime() - 10);
  }

  function handleForward() {
    songInfo.current.seekTo(songInfo.current.getCurrentTime() + 10);
  }

  return (
    <Box overflow={"hidden"}>
      <Slider
        aria-label="slider-ex-4"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => songInfo.current.seekTo(e)}
      >
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="tomato" as={MdGraphicEq} />
        </SliderThumb>
      </Slider>
      <Flex position={"relative"} border={"1px solid black"}>
        <Button>
          <FontAwesomeIcon icon={faBackward} />
        </Button>
        <Button onClick={handleRewind}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
        <Button
          onClick={() => {
            setIsPlaying(!isPlaying);
            setRerenderCount(0);
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </Button>
        <Button onClick={handleForward}>
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
        <Button>
          <FontAwesomeIcon icon={faForward} />
        </Button>
        <Box lineHeight={"40px"}>
          {elapsedTime} / {totalDuration}
        </Box>
        <ReactPlayer
          style={{ position: "absolute", left: "50%" }}
          ref={songInfo}
          playing={isPlaying}
          url={top100.map((a) => a.songUrl)}
        />
      </Flex>
    </Box>
  );
}

export default PlayComp;
