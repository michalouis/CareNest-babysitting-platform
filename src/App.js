import { BrowserRouter } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ScrolltoTop from "./layout/ScrolltoTop";
import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>CareNest - Η φωλιά της φροντίδας</title>
      </head>

      <body>
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
      </body>
    </html>
  );
}