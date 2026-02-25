import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicationPage from "./pages/ApplicationPage";
import NewApplicationPage from "./pages/NewApplicationPage";
import AdminPage from "./pages/AdminPage";
import "./styles/App.css";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      setUser(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Банкетам.Нет</Link>
      </div>
      <nav className="nav">
        {!user && (
          <>
            <Link to="/">Главная</Link>
            <Link to="/login">Логин</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
        {user && user.role === "user" && (
          <>
            <Link to="/">Главная</Link>
            <Link to="/application">Заявки</Link>
            <Link to="/applications">Оформление заявки</Link>
            <button className="link-btn" type="button" onClick={logout}>
              Выход
            </button>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link to="/">Главная</Link>
            <Link to="/admin">Админ-панель</Link>
            <button className="link-btn" type="button" onClick={logout}>
              Выход
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/application" element={<ApplicationPage />} />
        <Route path="/applications" element={<NewApplicationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
