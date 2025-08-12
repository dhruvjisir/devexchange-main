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
                'key': '307dc4ca48e045e034b3547d698162df', 
                'format': 'iframe', 
                'height': 600, 
                'width': 160, 
                'params': {} 
              };
              
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = '//www.highperformanceformat.com/307dc4ca48e045e034b3547d698162df/invoke.js';
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

  return <div ref={ref} className="ad-skyscraper-160x600" />;
}
