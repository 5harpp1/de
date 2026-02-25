import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import "../styles/RegisterPage.css";
const API = "http://localhost:5000/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [commonError, setCommonError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onPhoneAccept = (value) => {
    setForm((f) => ({ ...f, phone: value }));
  };

  const validateClient = () => {
    const newErrors = {};
    if (!/^[А-Яа-яЁё\s]+$/.test(form.fullName)) {
      newErrors.fullName = "ФИО только кириллица";
    }
    if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(form.phone)) {
      newErrors.phone = "Телефон в формате +7(XXX)-XXX-XX-XX";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Некорректный email";
    }
    if (!form.login.trim()) {
      newErrors.login = "Логин обязателен";
    } else {
      if (form.login.trim().length < 6) {
        newErrors.login = "Логин минимум 6 символов";
      } else if (!/^[A-Za-z\s]+$/.test(form.login.trim())) {
        newErrors.login = "Логин должен быть на латинице";
      }
    }
    if (form.password.length < 8) {
      newErrors.password = "Пароль минимум 8 символов";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCommonError("");
    if (!validateClient()) return;

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setCommonError("Не удалось зарегистрироваться");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch {
      setCommonError("Ошибка подключения к серверу");
    }
  };

  return (
    <div className="register-page">
      <h2 className="register-tittle"> Регистрация</h2>
      {commonError && <div className="register-error">{commonError}</div>}
      <form onSubmit={onSubmit} className="register-form">
        <div className="register-field">
          <input
            name="login"
            placeholder="логин"
            value={form.login}
            onChange={onChange}
          />
          <div className="register-error">{errors.login}</div>
          <input
            name="password"
            placeholder="пароль"
            type="password"
            value={form.password}
            onChange={onChange}
          />
          <div className="register-error">{errors.password}</div>
          <input
            name="fullName"
            placeholder="ФИО"
            value={form.fullName}
            onChange={onChange}
          />
          <div className="register-error">{errors.fullName}</div>
          <IMaskInput
            mask="+{7}(000)-000-00-00"
            placeholder="+7"
            value={form.phone}
            inputMode="tel"
            onAccept={onPhoneAccept}
          />
          <div className="register-error">{errors.phone}</div>
          <input
            name="email"
            placeholder="почта"
            value={form.email}
            onChange={onChange}
          />
          <div className="register-error">{errors.email}</div>
        </div>
        <button className="submit" type="submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
