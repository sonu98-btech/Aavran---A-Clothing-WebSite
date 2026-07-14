import express from 'express';
import cors from "cors"
import morgan from "morgan"
import {config} from "./config/config.js"
import cookieParser from 'cookie-parser';
const app = express();
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/api/auth/google/callback"
},(accessToken, refreshToken, profile, done)=>{
    done(null, profile);
}));

app.use(express.json());
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import passport from 'passport';

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart" , cartRouter)

export default app;