import { useEffect, useState } from "react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

const { Kakao } = window;

function KakaoShareComp({ title, imageUrl }) {
  const resultUrl = window.location.href;
  const [description, setDescription] = useState("Relieve에 방문해 보세요.");

  const { onOpen, isOpen, onClose } = useDisclosure();

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
          title: "Premium Music Lab_Relieve",
          link: {
            webUrl: resultUrl,
          },
        },
      ],
    });
  };

  return (
    <>
      <Tooltip label={"카카오톡 공유하기"} fontSize={"x-small"}>
        <Button
          onClick={onOpen}
          color={"yellow.700"}
          bg={"yellow"}
          size={"xs"}
          _hover={{ backgroud: "yellow" }}
        >
          <FontAwesomeIcon icon={faComment} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>설명을 입력해주세요.</ModalHeader>
          <ModalBody>
            <Input
              defaultValue={"Relieve에 방문해 보세요."}
              placeholder="Relieve에 방문해 보세요."
              onChange={(e) => setDescription(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={shareKakao} colorScheme="yellow">
              공유
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default KakaoShareComp;
