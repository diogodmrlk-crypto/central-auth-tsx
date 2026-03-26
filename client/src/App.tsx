import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("auth_session");
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_session");
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <Home onLogout={handleLogout} />
  ) : (
    <Login onLogin={() => setIsAuthenticated(true)} />
  );
}
