import { useEffect, useRef } from "react";

export default function Banner468x60() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      (window as any).atOptions = {
        key: "e6a2cca1f30dc6c7440e713a9203abbb",
        format: "iframe",
        height: 60,
        width: 468,
        params: {}
      };

      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "//www.highperformanceformat.com/e6a2cca1f30dc6c7440e713a9203abbb/invoke.js";
      s.async = true;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(s);
      } else {
        document.body.appendChild(s);
      }
    } catch (error) {
      // ignore errors to avoid breaking rendering
    }
  }, []);

  return <div ref={containerRef} className="ad-banner-468x60" />;
}
