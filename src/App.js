import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ScrolltoTop from "./layout/ScrolltoTop";
import LandingPage from "./pages/landingpage/LandingPage";
import Faq from './pages/faq/Faq';
import Messages from './pages/messages/Messages';
import Contact from "./pages/contact/Contact";

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
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/faq" element={<Faq />} />
							<Route path="/messages" element={<Messages />} />
						</Routes>
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
