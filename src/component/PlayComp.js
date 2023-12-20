import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import ReactPlayer from "react-player/lazy";
import { useRef, useState } from "react";
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
  faRepeat,
  faRotateLeft,
  faRotateRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdGraphicEq } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function PlayComp({ isOpen, onClose, songList, index, setIndex, endIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isBuffer, setIsBuffer] = useState(false);
  const [rerenderCount, setRerenderCount] = useState(0);

  const songInfo = useRef("");

  const navigate = useNavigate(); // 페이지 이동

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

  function goToSongPage(id) {
    navigate(`/main/song/${id}`);
  }

  function handlePreSong() {
    if (index - 1 > 0) setIndex(index - 1);
    else setIndex(songList.length - 1);
  }

  function handleNextSong() {
    if (index + 1 < songList.length) setIndex(index + 1);
    else setIndex(0);
  }

  function handleSongEnded() {
    setIndex(index + 1);
    if (songList !== null && index === songList.length - 1) {
      setIndex(0);
      if (!isRepeat) setIsPlaying(!isPlaying);
    }
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
        setShowTooltip(false);
        setIsBuffer(false);
        songInfo.current.seekTo(0);
        onClose();
      }}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader onClick={() => goToSongPage(songList.at(index).id)}>
            <Box cursor={"pointer"} w={"fit-content"}>
              {songList !== null && songList.at(index).title}
            </Box>
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
                <SliderTrack bg="purple.100">
                  <SliderFilledTrack bg="#ae8af1" />
                </SliderTrack>
                <Tooltip
                  color="tomato"
                  bg="none"
                  placement="top"
                  isOpen={showTooltip}
                  label={elapsedTime}
                >
                  <SliderThumb boxSize={6}>
                    <Box color="#f799c9" as={MdGraphicEq} />
                  </SliderThumb>
                </Tooltip>
              </Slider>
              <Flex position={"relative"}>
                <Box mx={4} lineHeight={"40px"} onClick={handlePreSong}>
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
                  <FontAwesomeIcon
                    icon={isBuffer ? faSpinner : isPlaying ? faPause : faPlay}
                  />
                </Box>
                <Box mr={4} lineHeight={"40px"} onClick={handleForward}>
                  <FontAwesomeIcon icon={faRotateRight} />
                </Box>
                <Box mr={4} lineHeight={"40px"} onClick={handleNextSong}>
                  <FontAwesomeIcon icon={faForward} />
                </Box>
                <Box lineHeight={"40px"}>
                  {elapsedTime} / {totalDuration}
                </Box>
                <ReactPlayer
                  style={{ position: "absolute", left: "-100%" }}
                  onEnded={handleSongEnded}
                  ref={songInfo}
                  playing={isPlaying}
                  url={songList !== null && songList.at(index).songUrl}
                  onBuffer={() => setIsBuffer(true)}
                  onBufferEnd={() => setIsBuffer(false)}
                  config={{
                    youtube: {
                      playerVars: {
                        apiKey: "AIzaSyCqaIb2dfvBES9JyV1Usi-z2ly4dKcqWmU",
                      },
                    },
                  }}
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
