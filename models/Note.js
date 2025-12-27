const mongoose = require("mongoose");

const noteShema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: true,
            trim: true,
        },
        Content: {
            type: String,
            required: true,
            trim: true,
        },
        Date: {
            type: String,
            default: () => Date.now().toLocaleString(),
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Note", noteShema);