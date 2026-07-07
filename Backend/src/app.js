import express from 'express';
const app = express();
app.use(express.json());
import authRouter from './routes/auth.routes.js';

app.use("/api/auth", authRouter);

export default app;