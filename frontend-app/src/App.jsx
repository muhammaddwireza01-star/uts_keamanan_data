import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PengirimPage from "./pages/PengirimPage";
import PenerimaPage from "./pages/PenerimaPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/penerima" element={<PenerimaPage />} />
        <Route path="/pengirim" element={<PengirimPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
