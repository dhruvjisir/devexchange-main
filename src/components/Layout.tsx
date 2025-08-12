import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "./Footer";
import InlineAd from "@/components/ads/InlineAd";
import Banner468x60 from "@/components/ads/Banner468x60";
import SkyscraperRail from "@/components/SkyscraperRail";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SkyscraperRail />
      <NavBar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Top ad section */}
          <div className="py-6 flex flex-col items-center gap-6">
            <InlineAd />
            <Banner468x60 />
          </div>
          
          {/* Main content */}
          <div className="py-6">
            <Outlet />
          </div>
          
          {/* Bottom ad section */}
          <div className="py-6 flex flex-col items-center gap-6">
            <Banner468x60 />
            <InlineAd />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 