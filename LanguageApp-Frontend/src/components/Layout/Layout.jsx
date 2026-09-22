import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Layout() {
  const location = useLocation();
  const isLoginSignUpPage =
    location.pathname === "/loginSignUp" || location.pathname === "/login";
  return (
    <>
      {!isLoginSignUpPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isLoginSignUpPage && <Footer />}
    </>
  );
}

export default Layout;
