import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/Authroutes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth", router);

const server = app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});

mongoose.connect(databaseUrl)
    .then(() => console.log("chatApp database is connected"))
    .catch((err) => console.log(err.message));
