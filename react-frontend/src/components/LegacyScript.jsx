import { useEffect, useRef } from "react";

function LegacyScript({ src, module = false }) {
  const executed = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in development — this
    // prevents the same legacy script from being injected twice.
    if (executed.current) return;
    executed.current = true;

    const script = document.createElement("script");
    script.src = src;
    script.type = module ? "module" : "text/javascript";
    script.async = false; // preserves original <script src> execution order

    script.onerror = (err) => {
      console.error("Unable to load legacy script:", src, err);
    };

    document.body.appendChild(script);

    return () => {
      // remove the script tag on unmount so re-visiting the page
      // re-runs its setup logic cleanly
      script.remove();
    };
  }, [src, module]);

  return null;
}

export default LegacyScript;
