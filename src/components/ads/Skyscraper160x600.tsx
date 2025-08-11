import { useEffect, useRef } from "react";

export default function Skyscraper160x600() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const iframe = document.createElement("iframe");
    iframe.width = "160";
    iframe.height = "600";
    iframe.style.border = "0";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    // Allow scripts but disallow top navigation/popups
    iframe.sandbox.add("allow-scripts");

    ref.current.innerHTML = "";
    ref.current.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body style=\"margin:0;\">\n      <script type=\"text/javascript\">\n        atOptions = { key: '307dc4ca48e045e034b3547d698162df', format: 'iframe', height: 600, width: 160, params: {} };\n      </script>\n      <script type=\"text/javascript\" src=\"//www.highperformanceformat.com/307dc4ca48e045e034b3547d698162df/invoke.js\"></script>\n    </body></html>`);
    doc.close();

    return () => {
      try { if (ref.current) ref.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div ref={ref} className="ad-skyscraper-160x600" />;
}
