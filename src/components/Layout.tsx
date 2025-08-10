import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <main className="flex-grow w-full py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Outlet />
          <script async data-cfasync="false" src="//pl27387750.profitableratecpm.com/ccb6e5efad6fd82048f4a2fc01cf289f/invoke.js"></script>
          <div id="container-ccb6e5efad6fd82048f4a2fc01cf289f"></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout; 