const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const newNote = new Note({
            userId: req.user._id,
            title,
            content
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }   
});

router.put("/:id", authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, content },
            { new: true }
        );
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.status(200).json({ message: "Note deleted successfully" });  
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }   
});

module.exports = router;