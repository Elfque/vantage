const express = require("express");
const router = express.Router();
const {
  googleLogin,
  login,
  refreshToken,
  register,
  registerValidation,
} = require("../utils/auth");

function authRoutes(db) {
  router.post("/google", (req, res) => googleLogin(req, res, db));
  router.post("/login", (req, res) => login(req, res, db));
  router.post("/register", registerValidation, (req, res) =>
    register(req, res, db),
  );
  router.post("/refresh_token", (req, res) => refreshToken(req, res, db));

  return router;
}

module.exports = authRoutes;
