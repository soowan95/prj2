import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SongRequest from "../main/SongRequest";

export function SongEdit() {
  const toast = useToast();
  const navigate = useNavigate();

  const [songData, updateSongData] = useImmer({});
  const [albumList, setAlbumList] = useState(null);

  // const [song, updateSong] = useImmer({});
  const [params] = useSearchParams();
  const { id } = useParams();

  // 수정할 파일 업로드
  // const [uploadFile, setUploadFile] = useState(null);

  console.log(songData);

  useEffect(() => {
    axios.get("/api/song/" + id).then(({ data }) => {
      updateSongData(data);
      axios.get("/api/song/albumList?album=" + data.album).then(({ data }) => {
        setAlbumList(data);
      });
    });
  }, []);

  function handleSubmit() {
    // 저장 버튼 클릭시
    // PUT /api/main/song/id
    axios
      .putForm("/api/song/songEdit", {
        id: id,
        title: songData.title,
        artistName: songData.artistName,
        album: songData.album,
        artistGroup: songData.artistGroup,
        file: songData.uploadFile,
      })
      .then(() => {
        toast({
          description: "수정이 완료되었습니다 ☺️",
          status: "success",
        });
        // 수정이 완료되면 /main/song/id로 가고싶음....(= 내가 방금 수정한 페이지가 뜨게)
        navigate("/main/songEdit/" + id);
      })
      .catch((error) => {
        toast({
          description: "수정 중 문제 발생😱😱",
          status: "warning",
        });
      });
  }

  return (
    <Box>
      <Box>
        <br />
        <Flex>
          {/* 기존 이미지가 있을 수도 있고 없을 수도 있음 */}
          {/* 기존 이미지 띄우기 (수정은 할 수도 있고 안 할수도 있음) */}
          <Box mr={8}>
            <Image
              src={songData.artistFileUrl}
              boxSize="400px"
              objectFit="cover"
            />
          </Box>

          {/* 수정할 데이터 */}
          <Box>
            <FormControl>
              <FormLabel>노래 제목</FormLabel>
              <Input
                defaultValue={songData.title}
                onChange={(e) =>
                  updateSongData((draft) => {
                    draft.title = e.target.value;
                  })
                }
              />
            </FormControl>

            <Box mt={4}>
              <FormControl>
                <FormLabel>가수</FormLabel>
                <Input
                  defaultValue={songData.artistName}
                  onChange={
                    (e) =>
                      updateSongData((draft) => {
                        draft.artistName = e.target.value;
                      })
                    // params.set("artistName", e.target.value)
                  }
                />
                {/*<div>{songData.artistName}</div>*/}
              </FormControl>
            </Box>

            <Box mt={4}>
              <FormControl>
                <FormLabel>앨범명</FormLabel>
                <Input
                  defaultValue={songData.album}
                  onChange={(e) => {
                    updateSongData((draft) => {
                      draft.album = e.target.value;
                    });
                  }}
                />
                {/*<div>{songData.album}</div>*/}
              </FormControl>
            </Box>

            <Box mt={4}>
              <FormControl>
                <FormLabel>그룹명</FormLabel>
                <Input
                  defaultValue={songData.artistGroup}
                  onChange={(e) =>
                    updateSongData((draft) => {
                      draft.artistGroup = e.target.value;
                    })
                  }
                />
                {/*<div>{songData.artistGroup}</div>*/}
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* 수정할 사진 (= 새로 넣을 사진) */}
        <Box>
          <FormControl>
            <FormLabel>이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                updateSongData((draft) => {
                  draft.uploadFile = e.target.files[0];
                })
              }
            />
          </FormControl>

          <Flex gap={2}>
            <Tooltip label={"뒤로"}>
              <Button
                onClick={() => navigate(-1)}
                background={"lavender"}
                size={"sm"}
                w={16}
              >
                🔙
              </Button>
            </Tooltip>
            <Button
              onClick={handleSubmit}
              background={"plum"}
              size={"sm"}
              w={16}
            >
              수정
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
