import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "./Footer";
import InlineAd from "@/components/ads/InlineAd";
import Banner468x60 from "@/components/ads/Banner468x60";

const Layout = () => {
  return (
    <>
      <NavBar />
      <main className="flex-grow w-full py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Outlet />
          <div className="my-6 flex flex-col items-center gap-4">
            <InlineAd />
            <Banner468x60 />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout; 