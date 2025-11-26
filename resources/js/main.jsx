import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ExplorePage from "./components/ExplorePage";

export default function Main() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen bg-[#fafafa]">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
