import React, { useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ScrolltoTop from "./layout/ScrolltoTop";
import AppRoutes from "./AppRoutes";
import { useBeforeRender } from './hooks/useBeforeRender';

export default function App() {
  // Fix ResizeObserver loop limit exceeded error (https://stackoverflow.com/questions/75774800/how-to-stop-resizeobserver-loop-limit-exceeded-error-from-appearing-in-react-a)
  useBeforeRender(() => {
    window.addEventListener("error", (e) => {
      if (e) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div",
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay",
        );
        if (resizeObserverErr)
          resizeObserverErr.className = "hide-resize-observer";
        if (resizeObserverErrDiv)
          resizeObserverErrDiv.className = "hide-resize-observer";
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <div className="content">
            <AppRoutes />
          </div>
          <ScrolltoTop />
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}