import { useEffect } from "react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "@chakra-ui/react";

const { Kakao } = window;

function KakaoShareComp({ title, description, imageUrl }) {
  const resultUrl = window.location.href;

  useEffect(() => {
    Kakao.cleanup();
    Kakao.init("35b3a614b2e658216f8631108829b2e9");
  }, []);

  const shareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        link: {
          webUrl: resultUrl,
        },
      },
      buttons: [
        {
          title: "당장 들으러 가기",
          link: {
            webUrl: resultUrl,
          },
        },
      ],
    });
  };

  return (
    <Tooltip label={"카카오톡 공유하기"} fontSize={"x-small"}>
      <Button
        onClick={shareKakao}
        color={"yellow.700"}
        bg={"yellow"}
        size={"xs"}
        _hover={{ backgroud: "yellow" }}
      >
        <FontAwesomeIcon icon={faComment} />
      </Button>
    </Tooltip>
  );
}

export default KakaoShareComp;
