import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MyInfo } from "../page/main/MyInfo";
import SongRequestComp from "../component/SongRequestComp";
import _ from "lodash";
import LiveChatComp from "../component/LiveChatComp";
import "../css/Fonts.css";
import { faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MainLayout() {
  const [top100, setTop100] = useState(null);
  const [searched, setSearched] = useState(null);
  const [moods, setMoods] = useState(null);
  const [genres, setGenres] = useState(null);
  const [searchCategory, setSearchCategory] = useState("가수");
  const [selectedCategory, setSelectedCategory] = useState("가수");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [autoComplete, setAutoComplete] = useState(null);

  const genreInclude = useRef(",");
  const moodInclude = useRef(",");
  const genreMoodList = useRef([]);
  const searchRef = useRef(null);
  const scroll = useRef(null);

  const moodPopOver = useDisclosure();
  const genrePopOver = useDisclosure();

  const params = new URLSearchParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { toggleColorMode } = useColorMode();

  params.set("sc", searchCategory);
  params.set("sk", searchKeyword);

  // 사이트 시작할 때 top100, mood, genre db에서 가져오기
  useEffect(() => {
    axios.get("/api/song/top100").then(({ data }) => setTop100(data));
    axios.get("/api/song/mood").then(({ data }) => setMoods(data));
    axios.get("/api/song/genre").then(({ data }) => setGenres(data));
  }, []);

  // 자동 완성 정보 불러오기
  useEffect(() => {
    axios
      .get("/api/song/autoComplete?" + params)
      .then(({ data }) => setAutoComplete(data));
  }, [searchKeyword, searchCategory]);

  // 검색창 placeholder
  let searchInfoText = searchCategory;
  searchInfoText +=
    searchCategory === "제목" ? "을 검색해주세요." : "를 검색해주세요.";

  // 필터 버튼
  function handlePlusButton(e) {
    handleButtonColor(e);

    if (!genreMoodList.current.includes(e.target.value))
      genreMoodList.current.push(e.target.value);
    else
      genreMoodList.current = genreMoodList.current.filter(
        (a) => a !== e.target.value,
      );

    e.target.name = e.target.name === "true" ? "false" : "true";
    if (e.target.name === "true") {
      if (e.target.className.toString().includes("genre"))
        genreInclude.current = genreInclude.current + e.target.value + ",";
      else moodInclude.current = moodInclude.current + e.target.value + ",";
      if (location.pathname === "/main") {
        axios
          .get(
            "/api/song/ft100?genre=" +
              genreInclude.current +
              "&mood=" +
              moodInclude.current +
              "&" +
              params,
          )
          .then(({ data }) => {
            if (data.length === 0) data = null;
            setTop100(data);
          });
      } else {
        handleSearchButton();
      }
    } else {
      if (e.target.className.toString().includes("genre"))
        genreInclude.current = genreInclude.current.replace(e.target.value, "");
      else
        moodInclude.current = moodInclude.current.replace(e.target.value, "");
      if (location.pathname === "/main") {
        axios
          .get(
            "/api/song/ft100?genre=" +
              genreInclude.current +
              "&mood=" +
              moodInclude.current +
              "&" +
              params,
          )
          .then(({ data }) => {
            if (data.length === 0) data = null;
            setTop100(data);
          });
      } else {
        handleSearchButton();
      }
    }

    if (genreInclude.current.replaceAll(",", "") === "")
      genreInclude.current = "";
    if (moodInclude.current.replaceAll(",", "") === "")
      moodInclude.current = "";
  }

  // 필터 버튼 색 바꾸기
  function handleButtonColor(e) {
    e.target.style.background =
      e.target.style.background === "purple" ? "white" : "purple";
    e.target.style.color = e.target.style.color === "white" ? "black" : "white";
  }

  // 스타일을 동적으로 설정하는 함수
  const getButtonStyle = (category) => ({
    fontFamily: "YClover-Bold",
    color: selectedCategory === category ? "white" : "black",
    background: selectedCategory === category ? "#e9dcfa" : "white",
  });

  // 검색창 카테고리 바꾸기
  function handleSearchCategoryButton(e) {
    setSearchCategory(e.target.value);
    setSelectedCategory(e.target.value); // 클릭된 버튼의 타입으로 상태 업데이트
  }

  // 검색 버튼
  function handleSearchButton() {
    axios
      .get(
        "/api/song/search?genre=" +
          genreInclude.current +
          "&mood=" +
          moodInclude.current +
          "&" +
          params,
      )
      .then(({ data }) => setSearched(data))
      .finally(() => navigate("/main/search"));
  }

  // 검색창 입력시 실시간 정보 입력
  function handleChangeSearchInput(e) {
    setSearchKeyword(e.target.value);
    params.set("sc", searchCategory);
    params.set("sk", searchKeyword);
  }

  // 스크롤 위로
  function handleScroll() {
    scroll.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SongContext.Provider value={{ top100, searched }}>
      <Box
        ref={scroll}
        position={"relative"}
        width={"100%"}
        m={0}
        minH={"100vh"}
        overflowX={"hidden"}
        // 배경화면~!!!!!!
        bgImage={`url(${process.env.PUBLIC_URL}/img/darkmode.jpg)`}
      >
        <Button
          onClick={toggleColorMode}
          position={"absolute"}
          top={"3%"}
          right={"10%"}
        >
          테마바꾸기 버튼
        </Button>
        {/* 메인 로고 */}
        <Button
          size={"L"}
          mt={"50px"}
          style={{
            position: "relative",
            left: "50%",
            transform: "translate(-50%)",
            background: "none",
            color: "white",
          }}
          fontSize={"3rem"}
          onClick={() => {
            navigate("/main");
            // document.getElementById("searchInput").value = "";
            setSearchKeyword("");
          }}
        >
          <Box
            width={"150px"}
            height={"150px"}
            bgImage={`url(${process.env.PUBLIC_URL}/img/Relieve.png)`}
            backgroundSize={"100%"}
          />
        </Button>
        {/* 사용자 정보 */}
        <Box position={"absolute"} width={"20px"} right={"3%"} top={"50px"}>
          <MyInfo />
        </Box>
        {/* 필터 */}
        {(location.pathname === "/main" ||
          location.pathname === "/main/search") && (
          <Box
            position={"fixed"}
            top={"300px"}
            left={"3%"}
            height={"200px"}
            alignItems={"center"}
          >
            <Box textAlign={"center"} fontWeight={"bold"} fontSize={"1.5rem"}>
              FILTER
            </Box>
            <Popover
              isOpen={genrePopOver.isOpen}
              onOpen={genrePopOver.onOpen}
              onClose={genrePopOver.onClose}
              placement="right"
            >
              <PopoverTrigger>
                <Box mt={"30px"} textAlign={"center"}>
                  Genre
                </Box>
              </PopoverTrigger>
              <PopoverContent p={5} w={"100px"}>
                {genres !== null &&
                  genres.map((genre) => (
                    <Flex key={genre.id} my={"5px"} alignItems={"center"}>
                      <Button
                        className="genre"
                        h={"30px"}
                        w={"80px"}
                        borderRadius={"5px"}
                        onClick={(e) => handlePlusButton(e)}
                        bg={
                          localStorage.getItem("chakra-ui-color-mode") ===
                          "light"
                            ? "white"
                            : "black"
                        }
                        value={genre.genre}
                        name="false"
                      >
                        {genre.genre}
                      </Button>
                    </Flex>
                  ))}
              </PopoverContent>
            </Popover>
            <Popover
              isOpen={moodPopOver.isOpen}
              onOpen={moodPopOver.onOpen}
              onClose={moodPopOver.onClose}
              placement="right"
            >
              <PopoverTrigger>
                <Box mt={"30px"} textAlign={"center"}>
                  Mood
                </Box>
              </PopoverTrigger>
              <PopoverContent p={5} w={"100px"}>
                {moods !== null &&
                  moods.map((mood) => (
                    <Flex key={mood.id} my={"5px"} alignItems={"center"}>
                      <Button
                        className="mood"
                        h={"30px"}
                        w={"80px"}
                        borderRadius={"5px"}
                        onClick={(e) => handlePlusButton(e)}
                        bg={
                          localStorage.getItem("chakra-ui-color-mode") ===
                          "light"
                            ? "white"
                            : "black"
                        }
                        value={mood.mainMood}
                      >
                        {mood.mainMood}
                      </Button>
                    </Flex>
                  ))}
              </PopoverContent>
            </Popover>
          </Box>
        )}
        {/* 검색 카테고리 */}
        {(location.pathname === "/main" ||
          location.pathname === "/main/search") && (
          <FormControl width={"100%"} height={"50px"} mt={"40px"}>
            <Flex width={"70%"} m={"0 auto"}>
              <Button
                value={"가수"}
                style={getButtonStyle("가수")}
                onClick={(e) => handleSearchCategoryButton(e)}
              >
                가수
              </Button>
              <Button
                value={"제목"}
                style={getButtonStyle("제목")}
                onClick={(e) => handleSearchCategoryButton(e)}
              >
                제목
              </Button>
              <Button
                value={"가사"}
                style={getButtonStyle("가사")}
                onClick={(e) => handleSearchCategoryButton(e)}
              >
                가사
              </Button>
            </Flex>
            {/* 검색창 */}
            <Flex
              position={"relative"}
              width={"70%"}
              m={"0 auto"}
              alignItems={"center"}
            >
              {genreMoodList !== null &&
                genreMoodList.current.map((key) => (
                  <Button
                    mr={2}
                    key={key}
                    value={key}
                    size={"sm"}
                    fontSize={"0.8rem"}
                    colorScheme="orange"
                  >
                    {key}
                  </Button>
                ))}
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Input
                    ref={searchRef}
                    id="searchInput"
                    height={"45px"}
                    placeholder={searchInfoText}
                    onChange={(e) => {
                      handleChangeSearchInput(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchButton();
                    }}
                  />
                </PopoverTrigger>
                <Button
                  id="searchButton"
                  border={"1px solid purple"}
                  height={"45px"}
                  width={"5%"}
                  onClick={handleSearchButton}
                  style={{ fontFamily: "YClover-Bold" }}
                >
                  검색
                </Button>
                <PopoverContent
                  w={{
                    base: "500px",
                    lg: "700px",
                    xl: "900px",
                    "2xl": "1200px",
                  }}
                >
                  {autoComplete !== null &&
                  autoComplete.length !== 0 &&
                  searchCategory === "가수"
                    ? _.uniqBy(autoComplete, "artistName")
                        .filter((song, index) => index < 10)
                        .map((song) => (
                          <Flex
                            key={song.id}
                            onClick={() => {
                              params.set("sk", song.artistName);
                              handleSearchButton();
                            }}
                            justifyContent={"center"}
                          >
                            <Box w={"20%"}>{song.artistName}</Box>
                            <Box w={"20%"} textAlign={"left"}>
                              {song.title}
                            </Box>
                            <Box w={"40%"} textAlign={"left"}>
                              {song.lyric.slice(0, 21)}...
                            </Box>
                          </Flex>
                        ))
                    : searchCategory === "제목"
                      ? _.uniqBy(autoComplete, "title")
                          .filter((song, index) => index < 10)
                          .map((song) => (
                            <Flex
                              key={song.id}
                              onClick={() => {
                                params.set("sk", song.title);
                                handleSearchButton();
                              }}
                              justifyContent={"center"}
                            >
                              <Box w={"20%"}>{song.artistName}</Box>
                              <Box w={"20%"} textAlign={"left"}>
                                {song.title}
                              </Box>
                              <Box w={"40%"} textAlign={"left"}>
                                {song.lyric.slice(0, 21)}...
                              </Box>
                            </Flex>
                          ))
                      : _.uniqBy(autoComplete, "lyric")
                          .filter((song, index) => index < 10)
                          .map((song) => (
                            <Flex
                              key={song.id}
                              onClick={() => {
                                params.set("sk", song.lyric);
                                handleSearchButton();
                              }}
                              justifyContent={"center"}
                            >
                              <Box w={"20%"}>{song.artistName}</Box>
                              <Box w={"20%"} textAlign={"left"}>
                                {song.title}
                              </Box>
                              <Box w={"40%"} textAlign={"left"}>
                                {song.lyric.slice(0, 21)}...
                              </Box>
                            </Flex>
                          ))}
                  {autoComplete !== null && autoComplete.length === 0 && (
                    <SongRequestComp />
                  )}
                </PopoverContent>
              </Popover>
            </Flex>
          </FormControl>
        )}
        <Button
          position={"fixed"}
          bottom={"7%"}
          right={"3%"}
          onClick={handleScroll}
        >
          <FontAwesomeIcon icon={faSquareCaretUp} />
        </Button>
        <Outlet />
        <LiveChatComp />
      </Box>
    </SongContext.Provider>
  );
}

export const SongContext = createContext(null);
