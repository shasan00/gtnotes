import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool } from "../db/pool";
import passport from "passport";
import { configureGoogleStrategy } from "../services/googleStrategy";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function createJwt(userId: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const { email, password, firstName, lastName } = parsed.data;
  try {
    const existing = await getPool().query("select id from users where email=$1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await getPool().query(
      "insert into users (email, password_hash, first_name, last_name) values ($1,$2,$3,$4) returning id, email, first_name, last_name, role",
      [email, hash, firstName, lastName]
    );
    const user = result.rows[0];
    const token = createJwt(user.id, user.role);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  try {
    const result = await getPool().query(
      "select id, email, password_hash, first_name, last_name, role, google_id from users where email=$1",
      [email]
    );
    if (result.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];
    // If the user has a google_id but no password_hash, they should use Google SSO
    if (!user.password_hash && user.google_id) {
      return res.status(401).json({ error: "Account requires Google SSO. Please use Google login." });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = createJwt(user.id, user.role);
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/google/signup", (req, res) => {
  // Begin Google OAuth signup flow
  return passport.authenticate("google", { scope: ["profile", "email"], state: "signup" })(req, res);
});

router.get("/google/login", (req, res) => {
  // Begin Google OAuth login flow
  return passport.authenticate("google", { scope: ["profile", "email"], state: "login" })(req, res);
});

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }),
  async (req: any, res) => {
    // At this point req.user is the user record
    const user = req.user;
    const token = createJwt(user.id, user.role);
    // Redirect back to frontend with token so the SPA can store it
    const redirectUrl = process.env.GOOGLE_SUCCESS_REDIRECT || "http://localhost:8080/sign-in?token=" + encodeURIComponent(token);
    if (redirectUrl.includes("?")) {
      res.redirect(redirectUrl + (redirectUrl.endsWith("?") ? "" : "&") + "token=" + encodeURIComponent(token));
    } else {
      res.redirect(redirectUrl + "?token=" + encodeURIComponent(token));
    }
  }
);

router.get("/google/failure", (_req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
});

export default router;


