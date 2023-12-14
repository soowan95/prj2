import {
  Avatar,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";

export function MyInfo() {
  const { login, fetchLogin, isAuthenticated, disConnect } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogin();
  }, []);

  function handleLogOut() {
    axios.post("/api/member/logout").then(() => {
      disConnect();
      toast({
        description: "로그아웃 되었습니다",
        status: "success",
      });
      window.location.reload(0);
    });
    navigate("/");
  }
  return (
    <Popover trigger="hover">
      {/*//마우스를 피하면 없어지는 기능*/}
      <PopoverTrigger>
        <Avatar
          size="lg"
          name={login.nickName}
          src={login.profilePhoto}
          _hover={{ cursor: "pointer" }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {login ? <> {login.nickName} 님 환영합니다</> : "로그인 해주세요."}
        </PopoverHeader>
        <PopoverBody>
          <Button
            variant="ghost"
            onClick={() => navigate("/main/recommendplaylist")}
          >
            추천 플레이리스트
          </Button>
          <br />
          <Button onClick={() => navigate("/main/myplaylist")} variant="ghost">
            나의 재생목록
          </Button>
          <br />
          <Button variant="ghost" onClick={() => navigate("/main/memberinfo")}>
            내 정보
          </Button>
        </PopoverBody>
        <PopoverFooter>
          {isAuthenticated() && (
            <Button variant="ghost" onClick={handleLogOut}>
              로그아웃
            </Button>
          )}
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
