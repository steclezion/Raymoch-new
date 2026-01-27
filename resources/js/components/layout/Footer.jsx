import React from "react";

export default function Footer({ routes }) {
  return (
<footer className="ft">
  <div>
    © {new Date().getFullYear()} {routes.brandName || "Raymoch"}. All rights reserved.
  </div>
  <div>
    <a href={routes.privacy}>Privacy</a>
    <a href={routes.terms}>Terms</a>
    <a href={routes.cookies}>Cookies</a>
  </div>
</footer>
  );
}
