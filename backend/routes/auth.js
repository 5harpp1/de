const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("ФИО обязательно"),
    body("phone").notEmpty().withMessage("Телефон обязателен"),
    body("email").isEmail().withMessage("Некорректный email"),
    body("login").isLength({ min: 6 }).withMessage("Логин минимум 6 символов"),
    body("password").isLength({ min: 8 }).withMessage("Пароль минимум 8 символов"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phone, email, login, password } = req.body;

    try {
      const existing = await User.findOne({
        $or: [{ email }, { login }],
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином или email существует" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = await User.create({
        fullName,
        phone,
        email,
        login,
        password: hashed,
        role: "user",
      });

      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "24h" }
      );

      return res.json({
        token,
        user: { id: user.id, login: user.login, role: user.role },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

router.post(
  "/login",
  [
    body("login").notEmpty().withMessage("Логин обязателен"),
    body("password").notEmpty().withMessage("Пароль обязателен"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      if (login === "Admin26" && password === "Demo20") {
        const payload = { id: "admin", role: "admin" };
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || "secret_key",
          { expiresIn: "24h" }
        );
        return res.json({
          token,
          user: { id: "admin", login: "Admin26", role: "admin" },
        });
      }

      const user = await User.findOne({ login });
      if (!user) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }

      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "24h" }
      );

      return res.json({
        token,
        user: { id: user.id, login: user.login, role: user.role },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

module.exports = router;
