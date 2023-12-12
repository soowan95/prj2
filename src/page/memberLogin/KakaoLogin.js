import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../component/LoginProvider";

function KakaoLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const KAKAO_CODE = location.search.split("=")[1];

  const { connect } = useContext(LoginContext);

  const getKakaoToken = () => {
    fetch(`https://kauth.kakao.com/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=0f1a49455b8c431d9ecd4207f7e4a12d&redirect_uri=http://localhost:3000/kakaoLogin&code=${KAKAO_CODE}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          fetch(`https://kapi.kakao.com/v2/user/me`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              axios
                .post("/api/kakao/login", {
                  id: data.id,
                  email: data.kakao_account.email,
                  nickName: data.properties.nickname,
                })
                .then(() => {
                  connect(data.properties.nickname);
                  // localStorage.setItem("login", data.properties.nickname);
                  navigate("/main");
                });
            });
        }
      });
  };

  useEffect(() => {
    if (!location.search) return;
    getKakaoToken();
  }, []);

  return <div></div>;
}

export default KakaoLogin;
