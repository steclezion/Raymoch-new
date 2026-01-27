// resources/js/app.jsx
import React from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequestTrial from "./components/RequestTrial.jsx";
import "./components/trial.css"  //from "./components/trial.css"; // your component styles
import Login from "./components/Login.jsx";
import SignupPage from "./components/signup/SignupPage.jsx";
import PricingBasic from "./components/PricingBasic.jsx";
import SignupBasic from "./components/signup/SignupBasic.jsx";
import SignupPremium from "./components/signup/SignupPremium.jsx";
import SignupBusinessAccount from "./components/signup/SignupBusinessAccount.jsx";
import ExploreBusinesses from './pages/ExploreBusinesses.jsx';
import Companies from './pages/Companies.jsx';
import Entire from "./pages/Entire";




// Mount only if the element exists on the page
const entireRoot = document.getElementById("entire-root");

if (entireRoot) {
  const root = createRoot(entireRoot);
  root.render(<Entire />);
}



//SignupBusinessAccount


function App() {
  // routes will be injected by Blade into window.ROUTES
  const routes = (typeof window !== "undefined" ? window.ROUTES : {}) || {};
  return (
    <BrowserRouter>
      <Routes>
        {/* Your existing routes... */}

        {/* Signups */}
        <Route path="/signup" element={<Navigate to="/signup/basic" replace />} />
        <Route path="/signup/basic" element={<SignupBasic routes={routes} />} />
        <Route path="/signup/premium" element={<SignupPremium routes={routes} />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}






const rootEl = document.getElementById("explore-root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<ExploreBusinesses />);
}




const rootCompanies = document.getElementById("explore-companies");
if (rootCompanies) {
  const root = createRoot(rootCompanies);
  root.render(<Companies />);
}




const mountBasic = document.getElementById("signupBasicRoot");
if (mountBasic) {
  createRoot(mountBasic).render(<SignupBasic routes={window.ROUTES} />);
}

const mountPremium = document.getElementById("signupPremiumRoot");
if (mountPremium) {
  // alert("Mama Alamazino")
  createRoot(mountPremium).render(<SignupPremium routes={window.ROUTES} />);
}

//SignupBusinessAccountRoot

const mountBusiness = document.getElementById("SignupBusinessAccountRoot");
if (mountBusiness) {
  // alert("Mama Alamazino")
  createRoot(mountBusiness).render(<SignupBusinessAccount routes={window.ROUTES} />);
}


const main = document.getElementById("rootMain");
if (main) {
createRoot(main).render(<main routes={window.ROUTES} />);


}


// Optional: a simple NotFound component
function NotFound() {
  return <div style={{ padding: 24 }}>Page not found.</div>;
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
  const brandName = "Raymoch";
  createRoot(signupEl).render(<SignupPage routes={routes} />);
}






