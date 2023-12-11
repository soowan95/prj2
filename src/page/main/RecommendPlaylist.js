import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function RecommendPlaylist() {
  const { fetchLogin } = useContext(LoginContext);
  const [recommendList, setRecommendList] = useState(null);

  useEffect(() => {
    fetchLogin();
    axios
      .get("/api/myList/recommendplaylist")
      .then((response) => setRecommendList(response.data));
  }, []);

  return (
    <>
      <Box mt={50}>
        <Heading>요즘 뜨는 추천 플레이리스트!</Heading>
      </Box>
      <Flex>
        {/* S3 이미지 출력 */}
        {recommendList !== null &&
          recommendList.map((srl, idx) => (
            <Card w="sm">
              <CardHeader key={idx}>
                <Image src={srl.pictureUrl} alt={srl.picture} />
              </CardHeader>
              <CardBody>{srl.listName}</CardBody>
              <CardFooter>
                <FontAwesomeIcon icon={faRecordVinyl} />
                {srl?.songs} 곡
              </CardFooter>
              <CardFooter>
                <Button>asd</Button>
              </CardFooter>
            </Card>
          ))}
      </Flex>
    </>
  );
}

export default RecommendPlaylist;
