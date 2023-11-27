import React from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {HomeLayout} from "./Layout/HomeLayout";
import {LoginModal} from "./Member/LoginModal";
import {MyPlayList} from "./Component/MyPlayList";
import LogInProvider from "./Component/LoginProvider";
import {MyInfo} from "./Component/MyInfo";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route path="myplaylist" element={<MyPlayList />}/>
      <Route path="login" element={<LoginModal />} />
      <Route path="myinfo" element={<MyInfo />} />
    </Route>
  ),
);
function App(props) {
  return(
    <LogInProvider>
      <RouterProvider router={routes} />
    </LogInProvider>
  );
}

export default App;