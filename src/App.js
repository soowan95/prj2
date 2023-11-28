import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./MemberLogin";
import { MainLayout } from "./MainLayout";
import { SearchPage } from "./SearchPage";
import { Top100Page } from "./Top100Page";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route path="login" element={<MemberLogin />} />
    </Route>,
    <Route path="/main" element={<MainLayout />}>
      <Route index element={<Top100Page />} />
      <Route path="search" element={<SearchPage />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
