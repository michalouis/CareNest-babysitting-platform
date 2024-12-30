import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
import About from './About';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
