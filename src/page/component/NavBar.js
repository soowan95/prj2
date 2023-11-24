import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@chakra-ui/react";
import { LoginContext } from "./LogInProvider";
import { useContext } from "react";

export function NavBar() {
  const { isAuthenticated } = useContext(LoginContext);

  return (
    <>
      {isAuthenticated() || (
        <Button
          borderRadius={0}
          variant="ghost"
          size="lg"
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/signup")}
        >
          signup
        </Button>
      )}
    </>
  );
}
