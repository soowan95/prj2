import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { useRef, useState } from "react";
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
  faRepeat,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdGraphicEq } from "react-icons/md";

function PlayComp({ isOpen, onClose, songList, index, setIndex, endIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [isBuffer, setIsBuffer] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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

  function handlePreSong() {
    setIndex(index - 1);
  }

  function handleNextSong() {
    setIndex(index + 1);
  }

  function handleSongEnded() {
    setIndex(index + 1);
    if (songList !== null && index === songList.length - 1) {
      setIndex(0);
      if (!isRepeat) setIsPlaying(!isPlaying);
    }
  }

  function handleBuffer() {
    setIsBuffer(!isBuffer);
  }

  function handleShowTooltip() {
    setShowTooltip(!showTooltip);
  }

  return (
    <Drawer
      placement="bottom"
      isOpen={isOpen}
      onClose={() => {
        setIsPlaying(false);
        setIsRepeat(true);
        setIsBuffer(false);
        setShowTooltip(false);
        songInfo.current.seekTo(0);
        onClose();
      }}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            {songList !== null && songList.at(index).title}
          </DrawerHeader>
          <DrawerBody>
            <Box overflow={"hidden"}>
              <Slider
                aria-label="slider-ex-4"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => songInfo.current.seekTo(e)}
                onMouseEnter={handleShowTooltip}
                onMouseLeave={handleShowTooltip}
              >
                <SliderTrack bg="red.100">
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <Tooltip
                  color="tomato"
                  bg="none"
                  placement="top"
                  isOpen={showTooltip}
                  label={elapsedTime}
                >
                  <SliderThumb boxSize={6}>
                    <Box color="tomato" as={MdGraphicEq} />
                  </SliderThumb>
                </Tooltip>
              </Slider>
              <Flex position={"relative"}>
                <Box
                  mx={4}
                  lineHeight={"40px"}
                  isDisabled={index === 0}
                  onClick={handlePreSong}
                >
                  <FontAwesomeIcon icon={faBackward} />
                </Box>
                <Box mr={4} lineHeight={"40px"} onClick={handleRewind}>
                  <FontAwesomeIcon icon={faRotateLeft} />
                </Box>
                <Box
                  mr={4}
                  lineHeight={"40px"}
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    setRerenderCount(0);
                  }}
                >
                  {isBuffer ? (
                    <Spinner size={"xs"} />
                  ) : (
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                  )}
                </Box>
                <Box mr={4} lineHeight={"40px"} onClick={handleForward}>
                  <FontAwesomeIcon icon={faRotateRight} />
                </Box>
                <Box
                  mr={4}
                  lineHeight={"40px"}
                  isDisabled={songList !== null && index >= songList.length - 1}
                  onClick={handleNextSong}
                >
                  <FontAwesomeIcon icon={faForward} />
                </Box>
                <Box lineHeight={"40px"}>
                  {elapsedTime} / {totalDuration}
                </Box>
                <ReactPlayer
                  style={{ position: "absolute", left: "-100%" }}
                  onEnded={handleSongEnded}
                  onBuffer={handleBuffer}
                  onBufferEnd={handleBuffer}
                  ref={songInfo}
                  playing={isPlaying}
                  url={songList !== null && songList.at(index).songUrl}
                />
                <Box
                  lineHeight={"40px"}
                  position={"absolute"}
                  opacity={isRepeat ? 1 : 0.3}
                  right={5}
                  onClick={() => setIsRepeat(!isRepeat)}
                >
                  <FontAwesomeIcon icon={faRepeat} />
                </Box>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default PlayComp;
