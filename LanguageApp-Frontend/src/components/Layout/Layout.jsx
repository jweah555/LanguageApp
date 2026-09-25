import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import QuickTranslate from "../QuickTranslate/QuickTranslate";

function Layout() {
  const location = useLocation();
  const isLoginSignUpPage =
    location.pathname === "/loginSignUp" || location.pathname === "/login";
  // The Translate page already has the full translator
  const isTranslatePage = location.pathname === "/translate";
  return (
    <>
      {!isLoginSignUpPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isLoginSignUpPage && <Footer />}
      {!isLoginSignUpPage && !isTranslatePage && <QuickTranslate />}
    </>
  );
}

export default Layout;
