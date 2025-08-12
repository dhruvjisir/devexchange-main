import { useEffect, useRef } from "react";

export default function Banner468x60() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const iframe = document.createElement("iframe");
    iframe.width = "468";
    iframe.height = "60";
    iframe.style.border = "0";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.sandbox.add("allow-scripts");

    const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body style=\"margin:0;\">\n      <script type=\"text/javascript\">\n        atOptions = { key: 'e6a2cca1f30dc6c7440e713a9203abbb', format: 'iframe', height: 60, width: 468, params: {} };\n      </script>\n      <script type=\"text/javascript\" src=\"//www.highperformanceformat.com/e6a2cca1f30dc6c7440e713a9203abbb/invoke.js\"></script>\n    </body></html>`;

    iframe.srcdoc = html;

    ref.current.innerHTML = "";
    ref.current.appendChild(iframe);

    return () => {
      try { if (ref.current) ref.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div ref={ref} className="ad-banner-468x60 flex justify-center" />;
}
