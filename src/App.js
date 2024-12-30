import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import About from './About';
import Faq from './Faq';
import Messages from './Messages';

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
        	  <Routes>
        	    <Route path="/" element={<LandingPage />} />
        	    <Route path="/about" element={<About />} />
        	    <Route path="/messages" element={<Messages />} />
        	    <Route path="/faq" element={<Faq />} />
        	  </Routes>
        	</BrowserRouter>
        </div>
      </body>
    </html>

  );
}
