const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  table: {
    type: String,
    enum: ["зал", "ресторан", "летняя веранда", "закрытая веранда"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "phone"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Новая", "Банкет назначен", "Банкет завершен"],
    default: "Новая",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Application", ApplicationSchema);