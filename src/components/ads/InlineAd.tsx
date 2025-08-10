import { useEffect, useRef } from "react";

export default function InlineAd() {
  const containerId = "container-ccb6e5efad6fd82048f4a2fc01cf289f";
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const existing = document.getElementById(containerId);
    if (!existing) {
      const container = document.createElement("div");
      container.id = containerId;
      wrapperRef.current?.appendChild(container);
    }

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = "//pl27387750.profitableratecpm.com/ccb6e5efad6fd82048f4a2fc01cf289f/invoke.js";

    wrapperRef.current?.appendChild(s);

    return () => {
      // Clean-up: remove injected script and container to avoid duplicates
      try {
        if (wrapperRef.current) {
          wrapperRef.current.innerHTML = "";
        }
      } catch {}
    };
  }, []);

  return <div ref={wrapperRef} className="inline-ad-slot" />;
}
