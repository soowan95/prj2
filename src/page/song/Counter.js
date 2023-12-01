import { useEffect } from "react";
import axios from "axios";

const Counter = ({ setCount, songId }) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await axios.post(`/api/song/${songId}`);
        if (response.data.viewAdded) {
          setCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("에러 발생 : ", error);
      }
    };

    incrementView();
  }, [setCount, songId]);

  return null;
};

export default Counter;
