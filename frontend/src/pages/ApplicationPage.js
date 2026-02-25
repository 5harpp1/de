import { useEffect, useState } from "react";
import "../styles/ApplicationPage.css";
const API = "http://localhost:5000/api";
export default function ApplicationPage() {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Вы не авторизованы");
          return;
        }
        const res = await fetch(`${API}/applications/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setError("Не удалось загрузить заявки");
          return;
        }
        const data = await res.json();
        setList(data);
      } catch {
        setError("Ошибка подключения к серверу");
      }
    };
    load();
  }, []);

  return (
    <div className="applications-page">
      <h2>Мои заявки</h2>
      {error && <div className="error">{error}</div>}
      {list.length === 0 && !error && <div>У вас пока нет заявок</div>}
      <ul className="applications-list">
        {list.map((app) => (
          <li key={app._id} className="application-item">
            <div>Дата: {new Date(app.date).toLocaleDateString()}</div>
            <div>Время: {app.time}</div>
            <div>Место: {app.table}</div>
            <div>Оплата: {app.paymentMethod === "cash" ? "Наличные" : "По телефону"}</div>
            <div>Статус: {app.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}