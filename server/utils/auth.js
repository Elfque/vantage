const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const connect = require("../db/db");

const registerValidation = [
  body("full_name").trim().notEmpty().withMessage("Name is required").escape(),
  body("email").isEmail().withMessage("Valid email required"),
  //   body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 12 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter"),
];

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, sub: googleId, email_verified } = ticket.getPayload();

    if (!email_verified)
      return res.status(400).json({ message: "Unverified Google account." });

    const [users] = await connect.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    let user = users[0];

    if (user) {
      if (!user.google_id) {
        await connect.execute("UPDATE users SET google_id = ? WHERE id = ?", [
          googleId,
          user.id,
        ]);
        user.google_id = googleId;
      }
    } else {
      const [result] = await connect.execute(
        "INSERT INTO users (email, google_id, is_verified) VALUES (?, ?, ?)",
        [email, googleId, true]
      );
      user = {
        id: result.insertId,
        email,
        google_id: googleId,
        token_version: 0,
      };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh_token",
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Authentication failed." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await connect.execute(
      "SELECT id, email, password, full_name, token_version FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await argon2.verify(
      user.password,
      password + process.env.PASSWORD_PEPPER
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        name: user.full_name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        version: user.token_version,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An internal error occurred." });
  }
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, email, password } = req.body;

  try {
    const [existingUser] = await connect.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const passwordWithPepper = password + process.env.PASSWORD_PEPPER;
    const hashedPassword = await argon2.hash(passwordWithPepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const [result] = await connect.execute(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully.",
      userId: result.insertId,
    });
  } catch (error) {
    // console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).send({ ok: false, accessToken: "" });

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({ ok: false, accessToken: "" });
  }

  try {
    const [rows] = await connect.execute(
      "SELECT id, token_version, full_name FROM users WHERE id = ?",
      [payload.userId]
    );
    const user = rows[0];

    if (!user || user.token_version !== payload.version) {
      return res.status(401).send({ ok: false, accessToken: "" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, name: user.full_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id, version: user.token_version },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jid", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh_token",
    });

    return res.send({ ok: true, accessToken });
  } catch (err) {
    return res.status(500).send({ ok: false, accessToken: "" });
  }
};

module.exports = {
  googleLogin,
  login,
  register,
  refreshToken,
  registerValidation,
};
