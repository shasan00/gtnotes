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
    console.log("Login attempt for email:", email);
    if (result.rowCount === 0) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    console.log("User found:", { id: user.id, email: user.email, hasPasswordHash: !!user.password_hash, hasGoogleId: !!user.google_id });

    if (!user.password_hash) {
      console.log("User has no password hash, redirecting to Google SSO flow is likely happening on frontend.");
      // This scenario should ideally return an error, not redirect.
      // The frontend should handle this by prompting the user to use SSO or register a password.
      return res.status(401).json({ error: "Account requires Google SSO or password not set. Please use Google login." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log("Password mismatch for user:", user.email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("Password matched for user:", user.email);
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


