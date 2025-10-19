import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import "./styles/ui.css";
import Footer from "./components/Footer";

const App: React.FC = () => {
  console.log("✅ App com rotas reais renderizado");

  return (
    <Router>
      {/* ✅ Navbar corporativa fixa no topo */}
      <NavigationBar />

      {/* ✅ Container principal de rotas */}
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* ✅ Footer fixo */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
