const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

let tasks = [];
let idCounter = 1;

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    const task = {id: idCounter++, Title: req.body.Title, Content: req.body.Content, Date: new Date().toLocaleString() };
    tasks.unshift(task);
    res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const {Title, Content } = req.body;

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Not found" });
    }

    task.Title = Title;
    task.Content = Content;

    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port", PORT));