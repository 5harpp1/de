import { useState } from "react";
import "../styles/NewApplicationPage.css";

const API = "http://localhost:5000/api";

export default function NewApplicationPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    table: "зал",
    paymentMethod: "cash",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.date || !form.time || !form.table || !form.paymentMethod) {
      setError("Заполните все поля");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Вы не авторизованы");
        return;
      }

      const res = await fetch(`${API}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Не удалось отправить заявку");
        return;
      }

      setSuccess("Заявка успешно создана");
      setForm({
        date: "",
        time: "",
        table: "зал",
        paymentMethod: "cash",
      });
    } catch {
      setError("Ошибка подключения к серверу");
    }
  };

  return (
    <div className="new-application-page">
      <h2>Оформление заявки</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={onSubmit} className="new-application-form">
        <div>
          <label>
            Дата:
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
          </label>
        </div>
        <div>
          <label>
            Время:
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
            />
          </label>
        </div>
        <div>
          <label>
            Место:
            <select
              name="table"
              value={form.table}
              onChange={onChange}
            >
              <option value="зал">Зал</option>
              <option value="ресторан">Ресторан</option>
              <option value="летняя веранда">Летняя веранда</option>
              <option value="закрытая веранда">Закрытая веранда</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Способ оплаты:
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={onChange}
            >
              <option value="cash">Наличные</option>
              <option value="phone">По телефону</option>
            </select>
          </label>
        </div>
        <button type="submit">Отправить заявку</button>
      </form>
    </div>
  );
}
