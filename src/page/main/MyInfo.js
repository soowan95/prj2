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
  const [login, setLogin] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/logininfo").then(({ data }) => setLogin(data));
  }, []);
  return (
    <Popover>
      <PopoverTrigger>
        <Button fontSize={"1.7rem"}>
          <FontAwesomeIcon icon={faUser} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {login.nickName} 님
          <Button size="xs" ml={5}>
            LOGOUT
          </Button>
        </PopoverHeader>
        <PopoverBody>
          <Button onClick={() => navigate("/myplaylist")} variant="ghost">
            MyPlayList
          </Button>
        </PopoverBody>
        <PopoverFooter>Logout Button</PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
