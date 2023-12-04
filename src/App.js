import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./page/memberLogin/MemberLogin";
import { MainLayout } from "./layout/MainLayout";
import { Top100Page } from "./page/main/Top100Page";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import {MyPlayList} from "./page/main/MyPlayList";
import {MyInfo} from "./page/main/MyInfo";
import SongRequest from "./page/main/SongRequest";
import LoginProvider from "./component/LoginProvider";
import SongPage from "./page/song/SongPage";
import KakaoLogin from "./page/memberLogin/KakaoLogin";
import {RecommendedList} from "./page/main/RecommendedList";
import { SearchPage } from "./page/main/SearchPage";

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<HomeLayout/>}>
                <Route path="login" element={<MemberLogin/>}/>
                <Route path="kakaoLogin" element={<KakaoLogin/>}/>,
            </Route>
            <Route path="main" element={<MainLayout/>}>
                <Route path="myinfo" element={<MyInfo/>}/>
                <Route index element={<Top100Page/>}/>
                <Route path="search" element={<SearchPage/>}/>
                <Route path="myplaylist" element={<MyPlayList/>}/>
                <Route path="requestlist" element={<SongRequest/>}/>
                <Route path="song/:id" element={<SongPage/>}/>
                <Route path="recommended" element={<RecommendedList/>}/>
            </Route>
            ,
        </Route>,
    ),
);

function App(props) {
    return (
        <LoginProvider>
            <RouterProvider router={routes}/>
        </LoginProvider>
    );
}

export default App;
