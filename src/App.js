import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import ScrolltoTop from "./Layout/ScrolltoTop";
import LandingPage from "./LandingPage/LandingPage";
import Faq from './Faq/Faq';
import Messages from './Messages/Messages';
import Contact from "./Contact/Contact";

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
