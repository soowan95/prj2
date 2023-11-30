import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MyInfo } from "../page/main/MyInfo";
import SongRequestComp from "../component/SongRequestComp";
import _ from "lodash";

export function MainLayout() {
  const [top100, setTop100] = useState(null);
  const [searched, setSearched] = useState(null);
  const [moods, setMoods] = useState(null);
  const [genres, setGenres] = useState(null);
  const [searchCategory, setSearchCategory] = useState("가수");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [autoComplete, setAutoComplete] = useState(null);

  const genreInclude = useRef(",");
  const moodInclude = useRef(",");
  const genreMoodList = useRef([]);
  const searchRef = useRef(null);

  const moodPopOver = useDisclosure();
  const genrePopOver = useDisclosure();

  const params = new URLSearchParams();

  const location = useLocation();

  const navigate = useNavigate();

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
  }, [searchKeyword]);

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
          .then(({ data }) => setTop100(data));
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
          .then(({ data }) => setTop100(data));
      } else {
        handleSearchButton();
      }
    }

    if (genreInclude.current.replaceAll(",", "") === "")
      genreInclude.current = "";
    if (moodInclude.current.replaceAll(",", "") === "")
      moodInclude.current = "";
  }

  let isCtrl = false;
  let isAlt = false;

  // 단축키 누른 후
  document.onkeyup = (e) => {
    if (e.key === "Ctrl") isCtrl = false;
    if (e.key === "Alt") isAlt = false;
  };

  // 단축키 눌렀을때
  document.onkeydown = (e) => {
    if (e.key === "Ctrl") isCtrl = true;
    if (e.key === "Alt") isAlt = true;

    if (e.key === "Enter") document.getElementById("searchButton").click();
  };

  // 필터 버튼 색 바꾸기
  function handleButtonColor(e) {
    e.target.style.background =
      e.target.style.background === "purple" ? "white" : "purple";
    e.target.style.color = e.target.style.color === "white" ? "black" : "white";
  }

  // 검색창 카테고리 바꾸기
  function handleSearchCategoryButton(e) {
    setSearchCategory(e.target.value);
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

  return (
    <SongContext.Provider value={{ top100, searched }}>
      <Box position={"relative"} width={"100%"} m={0}>
        {/* 메인 로고 */}
        <Button
          size={"L"}
          mt={"50px"}
          style={{
            position: "relative",
            left: "50%",
            transform: "translate(-50%)",
          }}
          fontSize={"3rem"}
          onClick={() => {
            navigate("/main");
            // document.getElementById("searchInput").value = "";
            setSearchKeyword("");
          }}
        >
          RELIEVE
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
            <Box textAlign={"center"} fontSize={"1.5rem"}>
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
              <PopoverContent p={5}>
                {genres !== null &&
                  genres.map((genre) => (
                    <Flex key={genre.id} my={"5px"} alignItems={"center"}>
                      <p style={{ width: "60%" }}>{genre.genre}</p>
                      <Button
                        className="genre"
                        size={"xs"}
                        h={"13px"}
                        w={"13px"}
                        borderRadius={"5px"}
                        border={"1px solid black"}
                        onClick={(e) => handlePlusButton(e)}
                        value={genre.genre}
                        name="false"
                      >
                        +
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
              <PopoverContent p={5}>
                {moods !== null &&
                  moods.map((mood) => (
                    <Flex key={mood.id} my={"5px"} alignItems={"center"}>
                      <p style={{ width: "60%" }}>{mood.mainMood}</p>
                      <Button
                        className="mood"
                        size={"xs"}
                        h={"13px"}
                        w={"13px"}
                        borderRadius={"5px"}
                        border={"1px solid black"}
                        onClick={(e) => handlePlusButton(e)}
                        value={mood.mainMood}
                      >
                        +
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
                onClick={(e) => handleSearchCategoryButton(e)}
              >
                가수
              </Button>
              <Button
                value={"제목"}
                onClick={(e) => handleSearchCategoryButton(e)}
              >
                제목
              </Button>
              <Button
                value={"가사"}
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
              <Popover>
                <PopoverTrigger>
                  <Input
                    ref={searchRef}
                    id="searchInput"
                    height={"45px"}
                    placeholder={searchInfoText}
                    onChange={(e) => {
                      handleChangeSearchInput(e);
                    }}
                  />
                </PopoverTrigger>
                <Button
                  id="searchButton"
                  border={"1px solid purple"}
                  height={"45px"}
                  width={"5%"}
                  onClick={handleSearchButton}
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
                    ? _.uniqBy(autoComplete, "artistName").map((song) => (
                        <Box
                          key={song.id}
                          onClick={() => {
                            params.set("sk", song.artistName);
                            handleSearchButton();
                          }}
                        >
                          {song.artistName}
                        </Box>
                      ))
                    : searchCategory === "제목"
                      ? _.uniqBy(autoComplete, "title").map((song) => (
                          <Box
                            key={song.id}
                            onClick={() => {
                              params.set("sk", song.title);
                              handleSearchButton();
                            }}
                          >
                            {song.title}
                          </Box>
                        ))
                      : _.uniqBy(autoComplete, "lyric").map((song) => (
                          <Box
                            key={song.id}
                            onClick={() => {
                              params.set("sk", song.lyric);
                              handleSearchButton();
                            }}
                          >
                            {song.lyric}
                          </Box>
                        ))}
                  {autoComplete !== null && autoComplete.length === 0 && (
                    <SongRequestComp />
                  )}
                </PopoverContent>
              </Popover>
            </Flex>
          </FormControl>
        )}
        <Outlet />
      </Box>
    </SongContext.Provider>
  );
}

export const SongContext = createContext(null);
