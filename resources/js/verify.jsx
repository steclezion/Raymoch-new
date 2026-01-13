import React from "react";
import { createRoot } from "react-dom/client";
import VerifyCode from "./components/VerifyCode.jsx";

// You already set window.APP in the blade
const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <VerifyCode
      apiVerifyUrl={window.APP?.apiVerify}
      csrfToken={window.APP?.csrf}
      // optional: pass email from URL; the component can also read it itself
    />
  );
}
