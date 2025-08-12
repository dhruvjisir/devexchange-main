import Skyscraper160x600 from "@/components/ads/Skyscraper160x600";

export default function SkyscraperRail() {
  return (
    <>
      {/* Left rail */}
      <div
        className="hidden xl:block fixed top-24 left-4 z-20"
        style={{ width: 160, height: 600 }}
      >
        <Skyscraper160x600 />
      </div>

      {/* Right rail */}
      <div
        className="hidden xl:block fixed top-24 right-4 z-20"
        style={{ width: 160, height: 600 }}
      >
        <Skyscraper160x600 />
      </div>
    </>
  );
}
