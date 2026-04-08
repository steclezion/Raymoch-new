import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";



function toaster_test() {
  return (
    <>


      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
      />
    </>
  );
}


export default toaster_test