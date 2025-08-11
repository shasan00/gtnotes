import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import passport from "passport";
import session from "express-session";
import { configureGoogleStrategy, initializePassport } from "./services/googleStrategy";
import { initDb } from "./db/pool";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));


app.use(express.json());
app.use(cookieParser());
// minimal session for passport; we don't use cookie sessions client-side

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
configureGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });


