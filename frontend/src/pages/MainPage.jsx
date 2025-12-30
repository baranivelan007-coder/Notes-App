import { useState, useEffect } from "react";
import logo1 from "../assets/NotesIcon.png";
import logo2 from "../assets/pencil.png";
import logo3 from "../assets/close.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MainPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [noteId, setNoteId] = useState(null);

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    useEffect(() => {
        const loadNotes = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(res.data || []);
            } catch (err) {
                setError("Failed to fetch notes");
            } finally {
                setLoading(false);
            }
        };

        loadNotes();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        if (!title || !content) {
            setError("Title and content are required");
            return;
        }

        setLoading(true);
        try {
            if (isEditing && noteId) {
                const res = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/notes/${noteId}`,
                    { title, content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNotes(notes.map((n) => (n._id === noteId ? res.data : n)));
                setIsEditing(false);
                setNoteId(null);
            } else {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/notes`,
                    { title, content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNotes((prev) => [...prev, res.data]);
            }
            setShowPopup(false);
            setTitle("");
            setContent("");
        } catch (err) {
            setError(isEditing ? "Failed to update note" : "Failed to add note");
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            setError("Failed to delete note");
        }
    };

    const startEdit = (note) => {
        setIsEditing(true);
        setNoteId(note._id);
        setTitle(note.title || "");
        setContent(note.content || "");
        setShowPopup(true);
    };

    return(
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {/* NavBar */}
            <div className="flex items-center p-4 justify-between bg-slate-800 border-b border-slate-700">
                {/* Left Side */}
                <div className="flex items-center gap-2">
                    <img className="w-10 h-10" src={logo1} alt="App-Icon" />
                    <span className="font-bold ml-2 text-2xl text-slate-100">Notes</span>
                </div>
                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowPopup(true)} className="rounded-md p-1 hover:bg-slate-700/30"><img className="w-6.5 h-6.5" src={logo2} alt="Add" /></button>
                    <button onClick={logout} className="px-3 py-1.5 border border-slate-700 rounded-md hover:bg-slate-700/30">Logout</button>
                </div>
            </div>
            { /* name of user */}
            <div className="p-4 border-b border-slate-700 align-center">
                <h2 className="text-lg">Hi, <span className="font-semibold text-slate-200">{username}!</span></h2>
            </div>
            {/* Popup form */}
            { showPopup &&
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <form onSubmit={handleSubmit} className="fixed w-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 px-6 py-6 rounded-lg">
                    <div className="flex flex-row justify-between items-center mb-4">
                        <h2 className="font-bold text-xl">{isEditing ? "Edit Note" : "Add New Note"}</h2>
                        <button type="button" onClick={() => setShowPopup(false)} ><img className="w-5 h-5" src={logo3} alt="close" /></button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="noteTitle" className="font-semibold" >Title</label>
                        <input type="text" id="noteTitle" placeholder="Enter note title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-slate-700 rounded-md bg-transparent text-slate-100 focus:outline-none focus:border-slate-500" />
                        <label htmlFor="noteContent" className="font-semibold mt-2">Content</label>
                        <textarea id="noteContent" placeholder="Enter note content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border border-slate-700 rounded-md bg-transparent text-slate-100 h-32 focus:outline-none focus:border-slate-500"></textarea>
                        <div className="flex justify-end items-center px-3"><button type="submit" className="mt-4 px-4 py-2 rounded-md border border-slate-700 text-slate-100 hover:bg-slate-700/30">{isEditing ? (loading ? "Updating..." : "Update") : (loading ? "Adding..." : "Add Note")}</button></div>
                    </div>
                </form>
            </div>
            }
            { /* Main Content */}
            <main>
                { notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-300">No notes available</h2>
                        <p className="text-slate-400">Click the add icon to create your first note.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {notes.map((note) => (
                            <div key={note._id} className="bg-slate-800 border border-slate-700 rounded-md p-4">
                                <h3 className="font-bold text-lg text-slate-100">{note.title}</h3>
                                <p className="text-slate-300 mt-2">{note.content}</p>
                                <p className="text-slate-400 text-sm mt-4">{new Date(note.date).toLocaleDateString()}</p>
                                <button onClick={() => startEdit(note)} className="mt-2 px-3 py-1 border border-slate-600 text-slate-100 rounded-md hover:bg-slate-700/30">Edit</button>
                                <button onClick={() => deleteNote(note._id)} className="ml-2 mt-2 px-3 py-1 border border-rose-600 text-rose-400 rounded-md hover:bg-rose-700/10">Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}