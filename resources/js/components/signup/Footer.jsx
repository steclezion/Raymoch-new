

// resources/js/pages/Footer.jsx
import React from "react";

export default function Footer({ routes }) {
  const R = routes || (typeof window !== "undefined" ? window.ROUTES : {});
  return (
    <footer className="ft">
      <div>© {new Date().getFullYear()} Raymoch. All rights reserved.</div>
      <div>
        <a href={R.privacy ?? "/privacy"}>Privacy</a>
        <a href={R.terms ?? "/terms"}>Terms</a>
        <a href={R.cookies ?? "/cookies"}>Cookies</a>
      </div>
    </footer>
  );
}
