import { Outlet } from "react-router-dom";
import InlineAd from "@/components/ads/InlineAd";
import Banner468x60 from "@/components/ads/Banner468x60";
import SkyscraperRail from "@/components/SkyscraperRail";

export default function BlogLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SkyscraperRail />
      
      {/* Top ads */}
      <div className="w-full bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-6">
          <div className="flex flex-col items-center gap-6">
            <InlineAd />
            <Banner468x60 />
          </div>
        </div>
      </div>
      
      {/* Main blog content */}
      <div className="flex-1">
        <Outlet />
      </div>
      
      {/* Bottom ads */}
      <div className="w-full bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-6">
          <div className="flex flex-col items-center gap-6">
            <InlineAd />
            <Banner468x60 />
          </div>
        </div>
      </div>
    </div>
  );
}
