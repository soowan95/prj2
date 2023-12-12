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
  const [songData, setSongData] = useState({});
  const [song, updateSong] = useImmer({});
  const [params] = useSearchParams();
  const { id } = useParams();

  // 수정할 파일 업로드
  const [uploadFile, setUploadFile] = useState(null);
  console.log(songData);
  function handleSubmit() {
    // 저장 버튼 클릭시
    // PUT /api/main/song/id

    axios
      .put("/api/song/songEdit", {
        title: songData.title,
        artistName: songData.artistName,
        album: songData.album,
        artistGroup: songData.artistGroup,
        uploadFile,

        // title: "",
        // artistName: "",
        // album: "",
        // artistGroup: "",
        // uploadFile,
      })
      .then(() => {
        toast({
          description: "수정이 완료되었습니다 ☺️",
          status: "success",
        });
        // 수정이 완료되면 /main/song/id로 가고싶음....(= 내가 방금 수정한 페이지가 뜨게)
        navigate("/songEdit/" + id);
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
          <Box mr={8}>
            <Image src={params.get("url")} boxSize="400px" objectFit="cover" />
          </Box>

          {/* 수정할 데이터 */}
          <Box>
            <FormControl>
              <FormLabel>노래 제목</FormLabel>
              <Input defaultValue={params.get("title")} />
            </FormControl>

            <Box mt={4}>
              <FormControl>
                <FormLabel>가수</FormLabel>
                <Input
                  defaultValue={params.get("artistName")}
                  onChange={(e) =>
                    // updateSong((draft) => {
                    //   draft.artistName = e.target.value;
                    // })
                    params.set("artistName", e.target.value)
                  }
                />
                {/*<div>{songData.artistName}</div>*/}
              </FormControl>
            </Box>

            <Box mt={4}>
              <FormControl>
                <FormLabel>앨범명</FormLabel>
                <Input
                  defaultValue={params.get("album")}
                  onChange={(e) => {
                    updateSong((draft) => {
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
                  defaultValue={params.get("artistGroup")}
                  onChange={(e) =>
                    updateSong((draft) => {
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
              onChange={(e) => setUploadFile(e.target.files)}
            />
          </FormControl>

          <Flex gap={2}>
            <Button onClick={handleSubmit}>저장</Button>
            <Button onClick={() => navigate(-1)}>취소</Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
