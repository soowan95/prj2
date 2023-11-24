import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  BrowserRouter as Router,
  Outlet,
} from "react-router-dom";
import React from "react";
import { MemberSignup } from "./page/member/MemberSignup";

const routes = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<MemberSignup />} />),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
