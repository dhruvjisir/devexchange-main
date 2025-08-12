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
    // Allow scripts, same origin, and forms for ad functionality
    iframe.sandbox.add("allow-scripts", "allow-same-origin", "allow-forms");

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0; padding:0;">
          <script>
            (function() {
              var atOptions = { 
                'key': 'e6a2cca1f30dc6c7440e713a9203abbb', 
                'format': 'iframe', 
                'height': 60, 
                'width': 468, 
                'params': {} 
              };
              
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = '//www.highperformanceformat.com/e6a2cca1f30dc6c7440e713a9203abbb/invoke.js';
              document.body.appendChild(script);
            })();
          </script>
        </body>
      </html>`;

    iframe.srcdoc = html;

    ref.current.innerHTML = "";
    ref.current.appendChild(iframe);

    return () => {
      try { if (ref.current) ref.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div ref={ref} className="ad-banner-468x60 flex justify-center" />;
}
