import { useEffect, useRef } from "react";

export default function InlineAd() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100";
    iframe.style.border = "0";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    // Allow scripts, same origin, and forms for ad functionality
    iframe.sandbox.add("allow-scripts", "allow-same-origin", "allow-forms");

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0; padding:0;">
          <div id="container-ccb6e5efad6fd82048f4a2fc01cf289f"></div>
          <script>
            (function() {
              var script = document.createElement('script');
              script.async = true;
              script.setAttribute('data-cfasync', 'false');
              script.src = '//pl27387750.profitableratecpm.com/ccb6e5efad6fd82048f4a2fc01cf289f/invoke.js';
              document.body.appendChild(script);
            })();
          </script>
        </body>
      </html>`;

    iframe.srcdoc = html;

    wrapperRef.current.innerHTML = "";
    wrapperRef.current.appendChild(iframe);

    return () => {
      try { if (wrapperRef.current) wrapperRef.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div ref={wrapperRef} className="inline-ad-slot w-full flex justify-center" />;
}
