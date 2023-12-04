import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function MyInfo() {
  const {login} = useContext(LoginContext);
  const [loginInfo, setLoginInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/logininfo")
        .then((response) => setLoginInfo(response.data))
  }, []);
  return (
      <Popover>
        <PopoverTrigger>
          <Button fontSize={"1.7rem"}>
            <FontAwesomeIcon icon={faUser}/>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow/>
          <PopoverCloseButton/>
          <PopoverHeader>
            {loginInfo ? (
                <>
                  {loginInfo.nickName} 님 환영합니다
                </>
            ) : (
                "로딩 중..." // 또는 다른 로딩 처리 방식을 사용할 수 있습니다.
            )}
          </PopoverHeader>
          <PopoverBody>
            <Button variant="ghost" onClick={()=>navigate("/main/recommended")}>추천 플레이리스트</Button><br/>
            <Button onClick={() => navigate("/main/myplaylist")} variant="ghost">
              나의 재생목록
            </Button> <br/>
            <Button variant="ghost">나의 좋아요 목록</Button><br/>
            <Button variant="ghost">내 정보 수정</Button>
          </PopoverBody>
          <PopoverFooter>로그아웃</PopoverFooter>
        </PopoverContent>
      </Popover>
  );
}
