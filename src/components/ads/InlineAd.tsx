import { useEffect, useRef } from "react";

export default function InlineAd() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Prefer sandboxed iframe to isolate ad script and prevent top-level redirects
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100"; // flexible height; network may resize via content
    iframe.style.border = "0";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    // Allow scripts but block top navigation/popups
    iframe.sandbox.add("allow-scripts");

    wrapperRef.current.innerHTML = "";
    wrapperRef.current.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body>
      <div id="container-ccb6e5efad6fd82048f4a2fc01cf289f"></div>
      <script>document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('script');s.async=true;s.setAttribute('data-cfasync','false');s.src='//pl27387750.profitableratecpm.com/ccb6e5efad6fd82048f4a2fc01cf289f/invoke.js';document.body.appendChild(s);});</script>
    </body></html>`);
    doc.close();

    return () => {
      try {
        if (wrapperRef.current) wrapperRef.current.innerHTML = "";
      } catch {}
    };
  }, []);

  return <div ref={wrapperRef} className="inline-ad-slot w-full flex justify-center" />;
}
