const express = require("express");
const auth = require("../middleware/auth");
const Application = require("../models/Application");
const router = express.Router();

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await Application.find({ userId }).sort({ createdAt: -1 });
    return res.json(list);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { time, date, table, paymentMethod } = req.body;

    if (!time || !date || !table || !paymentMethod) {
      return res.status(400).json({ message: "Не все поля заполнены" });
    }

    const application = await Application.create({
      userId,
      time,
      date,
      table,
      paymentMethod,
      status: "Новая",
    });

    return res.json(application);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;