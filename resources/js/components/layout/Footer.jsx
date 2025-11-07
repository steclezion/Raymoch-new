import React from "react";

export default function Footer({ routes }) {
  return (
    <footer>
      <div>© 2025 Raymoch. All rights reserved.</div>
      <div>
        <a href={routes.privacy}>Privacy</a>
        <a href={routes.terms}>Terms</a>
        <a href={routes.cookies}>Cookies</a>
      </div>
    </footer>
  );
}
