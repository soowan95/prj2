import { Button } from "@chakra-ui/react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function KakaoLoginComp() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=0f1a49455b8c431d9ecd4207f7e4a12d&redirect_uri=http://3.35.16.24:8080/kakaoLogin&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Button w={"185px"} colorScheme="yellow" onClick={handleLogin}>
      <FontAwesomeIcon icon={faComment} />
      　카카오 로그인
    </Button>
  );
}

export default KakaoLoginComp;
