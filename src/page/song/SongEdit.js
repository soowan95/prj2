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
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SongRequest from "../main/SongRequest";

export function SongEdit() {
  const navigate = useNavigate();
  const [songData, setSongData] = useState({});
  const [song, updateSong] = useImmer({});
  const [params] = useSearchParams();

  // 수정할 파일 업로드
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    axios
      .get(
        "/api/song/songEdit?artistName=" +
          params.get("artistName") +
          "&artistGroup=" +
          params.get("artistGroup"),
      )
      .then((response) => updateSong(response.data));
  }, [params, updateSong]);

  // function handleSubmit() {
  //   // 저장 버튼 클릭시
  //   // PUT /api/song/songEdit
  //
  //   axios
  //     .putForm("/api/song/songEdit/", {
  //       title: songData.title,
  //       artistName: songData.artistName,
  //       album: songData.album,
  //       artistGroup: songData.artistGroup,
  //       uploadFile,
  //     })
  //     .then(() => {
  //       // 수정이 완료되면 /main/song/id로 가고싶음....(= 내가 방금 수정한 페이지가 뜨게)
  //       navigate("/");
  //     });
  // }

  return (
    <Box>
      <Box>
        <br />
        <Flex>
          {/* 삭제할 기존 사진 띄워야함.. 근데 안뜸....ㅎㅎㅎㅎ...... */}
          {/* useImmer를 사용해보자...... */}

          <Box mr={8}>
            <Image src={params.get("url")} boxSize="400px" objectFit="cover" />
          </Box>

          {/* 수정할 데이터 */}
          <Box>
            <FormControl>
              <FormLabel>노래 제목</FormLabel>
              <Input
                value={params.get("title")}
                fontSize="30px"
                color="purple"
              />
            </FormControl>

            <Box mt={4}>
              <FormControl>
                <FormLabel>가수</FormLabel>
                <Input
                  value={params.get("artistName")}
                  onChange={(e) =>
                    updateSong((draft) => {
                      draft.artistName = e.target.value;
                    })
                  }
                />
                {/*<div>{songData.artistName}</div>*/}
              </FormControl>
            </Box>

            <Box mt={4}>
              <FormControl>
                <FormLabel>앨범명</FormLabel>
                <Input
                  value={params.get("album")}
                  onChange={(e) =>
                    updateSong((draft) => {
                      draft.album = e.target.value;
                    })
                  }
                />
                {/*<div>{songData.album}</div>*/}
              </FormControl>
            </Box>

            <Box mt={4}>
              <FormControl>
                <FormLabel>그룹명</FormLabel>
                <Input
                  value={params.get("artistGroup")}
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
            <Button>저장</Button>
            <Button onClick={() => navigate(-1)}>취소</Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
