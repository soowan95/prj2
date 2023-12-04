// import React, { useState, useEffect } from "react";
// import axios from "axios";
//
// function Counter({ songId }) {
//   const [count, setCount] = useState(0);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(`/api/song/${songId}/view`);
//         setCount(response.data.countView);
//       } catch (error) {
//         console.error("에러 발생 : ", error);
//       }
//     };
//     fetchData();
//   }, [songId]);
//
//   return <div>{count}</div>;
// }
//
// export default Counter;
