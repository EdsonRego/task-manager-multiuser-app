import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import TaskRegister from "./pages/TaskRegister";
import Dashboard from "./pages/Dashboard";
import TaskSearch from "./pages/TaskSearch";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute"; // ✅ Import novo
import "./styles/ui.css";

const App: React.FC = () => {
  console.log("✅ App renderizado com rotas protegidas");

  return (
    <Router>
      <NavigationBar />

      <div style={{ paddingBottom: "120px" }}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/task-register"
            element={
              <PrivateRoute>
                <TaskRegister />
              </PrivateRoute>
            }
          />

          <Route
            path="/task-search"
            element={
              <PrivateRoute>
                <TaskSearch />
              </PrivateRoute>
            }
          />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
