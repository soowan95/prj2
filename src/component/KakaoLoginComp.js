import { Button } from "@chakra-ui/react";

function KakaoLoginComp() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=0f1a49455b8c431d9ecd4207f7e4a12d&redirect_uri=http://localhost:3000/kakaoLogin&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return <Button onClick={handleLogin}>카카오</Button>;
}

export default KakaoLoginComp;
