import { Outlet } from "react-router-dom";
import InlineAd from "@/components/ads/InlineAd";
import Banner468x60 from "@/components/ads/Banner468x60";
import SkyscraperRail from "@/components/SkyscraperRail";

export default function BlogLayout() {
  return (
    <div className="w-full">
      <SkyscraperRail />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl my-6 flex flex-col items-center gap-4">
        <InlineAd />
        <Banner468x60 />
      </div>
      <Outlet />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl my-6 flex flex-col items-center gap-4">
        <InlineAd />
        <Banner468x60 />
      </div>
    </div>
  );
}
