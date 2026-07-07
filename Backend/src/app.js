import express from 'express';
import cors from "cors"
import morgan from "morgan"
const app = express();

app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
import authRouter from './routes/auth.routes.js';

app.use("/api/auth", authRouter);

export default app;