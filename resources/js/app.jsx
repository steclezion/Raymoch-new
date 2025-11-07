// resources/js/app.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import RequestTrial from "./components/RequestTrial.jsx";
import "./components/trial.css"  //from "./components/trial.css"; // your component styles
import Login from "./components/Login.jsx";
import SignupPage from "./components/signup/SignupPage.jsx";
import PricingBasic from "./components/PricingBasic.jsx";
import SignupBasic from "./components/signup/SignupBasic.jsx";

const mountBasic = document.getElementById("signupBasicRoot");
if (mountBasic) {
  createRoot(mountBasic).render(<SignupBasic routes={window.ROUTES} />);
}



// Mount Pricing (Basic Plans) page
const pricingBasicEl = document.getElementById("pricingBasic");
if (pricingBasicEl) {
  createRoot(pricingBasicEl).render(
    <PricingBasic routes={window.ROUTES || {}} />
  );
}




const el = document.getElementById("root");


if (document.getElementById('root')) {
  createRoot(document.getElementById('root')).render(
    <RequestTrial
      apiUrl={window.APP?.apiTrial ?? '/api/trial-requests'}
      csrfToken={window.APP?.csrf ?? document.querySelector('meta[name="csrf-token"]')?.content}
    />
  );
}

const mount = document.getElementById("doot");
if (mount) {
  const boot = window.LOGIN_BOOT || {};
  createRoot(mount).render(
    <Login
      apiUrl={boot.apiLogin}
      csrfToken={boot.csrf}
      redirectTo={boot.redirectTo}
    />
  );

}



// Mount Sign Up page
const signupEl = document.getElementById("signup-root");
if (signupEl) {
  const routes = window.ROUTES || {};
  createRoot(signupEl).render(<SignupPage routes={routes} />);
}






