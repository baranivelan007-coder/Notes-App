const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

const originRegexString = process.env.FRONTEND_ORIGIN_REGEX || '(^https?:\\/\\/.*\\.vercel\\.app$)|(^https?:\\/\\/.*\\.netlify\\.app$)';
let originRegex = null;
try{
    originRegex = new RegExp(originRegexString);
}catch(err){
    console.warn('Invalid FRONTEND_ORIGIN_REGEX, ignoring regex:', originRegexString);
    originRegex = null;
}

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);

        if(allowedOrigins.indexOf(origin) !== -1){
            return callback(null, true);
        }

        if(originRegex && originRegex.test(origin)){
            return callback(null, true);
        }

        console.warn('Blocked CORS request from origin:', origin);
        return callback(new Error('CORS policy: origin not allowed'));
    },
    credentials: true,
}));

app.use("/register", require("./routes/reg"));
app.use("/login", require("./routes/log"));
app.use("/notes", require("./routes/protectRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});