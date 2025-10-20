import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import TaskRegister from "./pages/TaskRegister";
import Dashboard from "./pages/Dashboard";
import TaskSearch from "./pages/TaskSearch"; // ✅ import corrigido
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import "./styles/ui.css";

const App: React.FC = () => {
  console.log("✅ App renderizado com novas rotas");

  return (
    <Router>
      <NavigationBar />

      <div style={{ paddingBottom: "120px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/task-register" element={<TaskRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task-search" element={<TaskSearch />} /> {/* ✅ posição corrigida */}
          <Route path="*" element={<NotFound />} /> {/* ✅ sempre por último */}
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
