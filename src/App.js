import {MyPlayList} from "./Component/MyPlayList";
import LogInProvider from "./Component/LoginProvider";
import {MyInfo} from "./Component/MyInfo";
import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./MemberLogin";
import { MainLayout } from "./MainLayout";
import { SearchPage } from "./SearchPage";
import { Top100Page } from "./Top100Page";
import { MemberSignup } from "./page/member/MemberSignup";
import PasswordRecovery from "./page/member/PasswordRecovery";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

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
        <Route path="myplaylist" element={<MyPlayList />}/>
        <Route path="myinfo" element={<MyInfo />} />
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
    <LogInProvider>
      <LoginContext.Provider value={{ login, fetchLogin, isAuthenticated }}>
        <RouterProvider router={routes} />
      </LoginContext.Provider>
    </LogInProvider>
  );
}

export default App;