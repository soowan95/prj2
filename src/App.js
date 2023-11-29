import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./page/memberLogin/MemberLogin";
import { MainLayout } from "./layout/MainLayout";
import { SearchPage } from "./page/song/SearchPage";
import { Top100Page } from "./page/main/Top100Page";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { MyPlayList } from "./page/main/MyPlayList";
import { MyInfo } from "./page/main/MyInfo";
import songPage, { SongPage } from "./page/song/SongPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeLayout />}>
        <Route path="login" element={<MemberLogin />} />
      </Route>
      ,
      <Route path="main" element={<MainLayout />}>
        <Route index element={<Top100Page />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="myplaylist" element={<MyPlayList />} />
        <Route path="song/:id" element={<SongPage />} />
      </Route>
      ,
    </Route>,
  ),
);

export const LoginContext = createContext(null);

function App(props) {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  function isAuthenticated() {
    return login !== "";
  }

  console.log(login);

  return (
    <LoginContext.Provider value={{ login, fetchLogin, isAuthenticated }}>
      <RouterProvider router={routes} />
    </LoginContext.Provider>
  );
}

export default App;
