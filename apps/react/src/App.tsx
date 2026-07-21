import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PublicMarket } from "./pages/PublicMarket";
import { Showcase } from "./pages/Showcase";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/public-market" element={<PublicMarket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
