const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const notes = await Note.create(req.body);
        res.status(201).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const notes = await Note.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true }
        );
        res.status(201).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;