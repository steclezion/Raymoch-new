// resources/js/app.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import RequestTrial from "./components/RequestTrial.jsx";
import "./components/trial.css"  //from "./components/trial.css"; // your component styles

const el = document.getElementById("root");

// if (el) {
//   createRoot(el).render(
//     <React.StrictMode>
//       <RequestTrial apiUrl="/api/trial-requests" />
//     </React.StrictMode>
//   );
// }


createRoot(document.getElementById("root")).render(
  <RequestTrial
    apiUrl={window.APP.apiTrial}
    apiCheckUrl={window.APP.apiCheck}
    csrfToken={window.APP.csrf}
  />
);
