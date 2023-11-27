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

  const genreInclude = useRef(",");
  const moodInclude = useRef(",");
  const genreMoodList = useRef([]);

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

  function handleButtonColor(e) {
    e.target.style.background =
      e.target.style.background === "purple" ? "white" : "purple";
    e.target.style.color = e.target.style.color === "white" ? "black" : "white";
  }

  function handleSearchCategoryButton(e) {
    setSearchCategory(e.target.value);
  }

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

  return (
    <SongContext.Provider value={{ top100, searched }}>
      <Box position={"relative"} width={"100%"} m={0}>
        <Button
          onClick={() => {
            navigate("/main");
            document.getElementById("searchInput").value = "";
            setSearchKeyword("");
          }}
        >
          로고
        </Button>
        <Box
          position={"absolute"}
          width={"20px"}
          right={"0%"}
          top={"0%"}
          textAlign={"center"}
        >
          <FontAwesomeIcon icon={faUser} />
        </Box>
        <Box
          position={"fixed"}
          top={"300px"}
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
        <FormControl width={"100%"} height={"50px"}>
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
            <Input
              ml={2}
              id="searchInput"
              height={"45px"}
              placeholder="검색어를 입력해주세요"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button
              height={"45px"}
              width={"5%"}
              onClick={() => handleSearchButton()}
            >
              검색
            </Button>
          </Flex>
        </FormControl>
        <Outlet />
      </Box>
    </SongContext.Provider>
  );
}

export const SongContext = createContext(null);
