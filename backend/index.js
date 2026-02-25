const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require ("./routes/auth");
const applicationRoutes = require ("./routes/applications");
const adminRoutes = require ("./routes/admin");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

const MONGO_URL = 
process.env.MONGODB_URL || "mongodb://localhost:27017/bankets";
mongoose
.connect(MONGO_URL)
.then(() => console.log("Mongodb connect"))
.catch((err) => console.error("MongoDB error:" , err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Сервер запущен на порте'))
