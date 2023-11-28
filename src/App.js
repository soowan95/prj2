import { HomeLayout } from "./layout/HomeLayout";
import { MemberLogin } from "./MemberLogin";
import { MainLayout } from "./MainLayout";
import { SearchPage } from "./SearchPage";
import { Top100Page } from "./Top100Page";
import { MemberSignup } from "./page/member/MemberSignup";
import { PasswordRecovery } from "./page/member/PasswordRecovery";

const routes = createBrowserRouter(
  createRoutesFromElements(
    
    
    <Route path="/" element={<HomeLayout />}>
      <Route path="login" element={<MemberLogin />} />
      <Route path="membersingup" element={<MemberSignup />} />
      <Route path="prc" element={<PasswordRecovery />} />
      <Route path="main" element={<MainLayout />}>
        <Route index element={<Top100Page />} />
        <Route path="search" element={<SearchPage />} />
      </Route>,
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
