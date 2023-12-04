import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./page/memberLogin/MemberLogin";
import { MainLayout } from "./layout/MainLayout";
import { SearchPage } from "./page/song/SearchPage";
import { Top100Page } from "./page/main/Top100Page";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { MyPlayList } from "./page/main/MyPlayList";
import { MyInfo } from "./page/main/MyInfo";
import SongRequest from "./page/main/SongRequest";
import LoginProvider from "./component/LoginProvider";
import SongPage from "./page/song/SongPage";
import KakaoLogin from "./page/memberLogin/KakaoLogin";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeLayout />}>
        <Route path="login" element={<MemberLogin />} />
        <Route path="kakaoLogin" element={<KakaoLogin />} />,
      </Route>
      <Route path="main" element={<MainLayout />}>
        <Route index element={<Top100Page />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="myplaylist" element={<MyPlayList />} />
        <Route path="requestlist" element={<SongRequest />} />
        <Route path="song/:id" element={<SongPage />} />
      </Route>
      ,
    </Route>,
  ),
);

function App(props) {
  return (
    <LoginProvider>
      <RouterProvider router={routes} />
    </LoginProvider>
  );
}

export default App;
