const mongoose = require("mongoose");
const User = require("./User");

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        date: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);