import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export function MainLayout() {
  const [top100, setTop100] = useState(null);
  const [searched, setSearched] = useState(null);
  const [moods, setMoods] = useState(null);
  const [genres, setGenres] = useState(null);
  const [searchCategory, setSearchCategory] = useState("가수");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [autoComplete, setAutoComplete] = useState(null);
  const [accordionIndex, setAccordionIndex] = useState(1);

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

  // 검색창 외의 영역 클릭시 감지
  useEffect(() => {
    function handleOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setAccordionIndex(1);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [searchRef]);

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
            document.getElementById("searchInput").value = "";
            setSearchKeyword("");
          }}
        >
          RELIEVE
        </Button>
        {/* 사용자 정보 */}
        <Box
          position={"absolute"}
          width={"20px"}
          right={"3%"}
          top={"0%"}
          textAlign={"center"}
          fontSize={"1.7rem"}
        >
          <FontAwesomeIcon icon={faUser} />
        </Box>
        {/* 필터 */}
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
        {/* 검색 카테고리 */}
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
            <Accordion
              allowMultiple
              w={"100%"}
              bg={"white"}
              index={[accordionIndex]}
            >
              <AccordionItem>
                <AccordionButton>
                  <Input
                    ref={searchRef}
                    id="searchInput"
                    height={"45px"}
                    placeholder={searchInfoText}
                    onChange={(e) => {
                      handleChangeSearchInput(e);
                    }}
                    onClick={() => setAccordionIndex(0)}
                  />
                  <Button
                    border={"1px solid purple"}
                    height={"45px"}
                    width={"5%"}
                    onClick={() => handleSearchButton()}
                  >
                    검색
                  </Button>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {autoComplete !== null &&
                    autoComplete.map((song) => (
                      <Flex key={song.id} justifyContent={"space-between"}>
                        <Box>{song.title}</Box>
                        <Box>{song.artistName}</Box>
                      </Flex>
                    ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </FormControl>
        <Outlet />
      </Box>
    </SongContext.Provider>
  );
}

export const SongContext = createContext(null);
