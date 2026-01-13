import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import "./styles.css";

const el = document.getElementById("auth-root");
const mode = el?.dataset?.mode || "login";

const App = () => (mode === "signup" ? <Signup /> : <Login />);

createRoot(el).render(<App />);
