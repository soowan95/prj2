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
import PasswordRecovery from "./page/member/PasswordRecovery";

const routes = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<MemberSignup />} />),
  createRoutesFromElements(<Route path="/" element={<PasswordRecovery />} />),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
