import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import axios from "axios";
import {MyPlayList} from "./MyPlayList";


export function MyInfo() {
  const [login, setLogin] = useState("");
  useEffect(() => {
    axios.get("/api/member/logininfo")
      .then(({data}) => setLogin(data))
  }, []);
  return (
    <Popover>
      <PopoverTrigger>
        <Button>
          <FontAwesomeIcon icon={faUser}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow/>
        <PopoverCloseButton/>
        <PopoverHeader>{login.nickName} 님
          <Button size="xs" ml={5}>LOGOUT</Button></PopoverHeader>
        <PopoverBody>
          <MyPlayList/>
        </PopoverBody>
        <PopoverFooter>Logout Button</PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
