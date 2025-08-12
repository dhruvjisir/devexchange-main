import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "./Footer";
import InlineAd from "@/components/ads/InlineAd";
import Banner468x60 from "@/components/ads/Banner468x60";
import SkyscraperRail from "@/components/SkyscraperRail";

const Layout = () => {
  return (
    <>
      <SkyscraperRail />
      <NavBar />
      <main className="flex-grow w-full py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          {/* Top ad section */}
          <div className="mb-8 flex flex-col items-center gap-6">
            <InlineAd />
            <Banner468x60 />
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <Outlet />
          </div>
          
          {/* Bottom ad section */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <Banner468x60 />
            <InlineAd />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout; 