import { useState } from "react";
import "../styles/LoginPage.css";

const API = "http://localhost:5000/api";

export default function LoginPage() {
  const [form, setForm] = useState({ login: "", password: "" });
  const [errors, setErrors] = useState({});
  const [commonError, setCommonError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setCommonError("");

    if (!form.login.trim() || !form.password.trim()) {
      const newErrors = {};
      if (!form.login.trim()) newErrors.login = "Введите логин";
      if (!form.password.trim()) newErrors.password = "Введите пароль";
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const newErrors = {};
          data.errors.forEach((er) => {
            newErrors[er.param] = er.msg;
          });
          setErrors(newErrors);
        }
        if (data.message) setCommonError(data.message);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "admin") window.location.href = "/";
        else window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setCommonError("Ошибка при авторизации");
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-tittle">Вход</h2>
      {commonError && <div className="login-error">{commonError}</div>}
      <form onSubmit={onSubmit} className="login-form">
        <input
          name="login"
          placeholder="логин"
          value={form.login}
          onChange={onChange}
        />
        <div className="login-error">{errors.login}</div>
        <input
          name="password"
          type="password"
          placeholder="пароль"
          value={form.password}
          onChange={onChange}
        />
        <div className="login-error">{errors.password}</div>
        <button type="submit">Войти</button>
        <p className="login-lin">
          Нет аккаунта? <a href="/register">Зарегистрируйся</a>
        </p>
      </form>
    </div>
  );
}