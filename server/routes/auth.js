const express = require("express");
const router = express.Router();
const {
  googleLogin,
  login,
  refreshToken,
  register,
  registerValidation,
} = require("../utils/auth");

router.post("/google", googleLogin);
router.post("/login", login);
router.post("/register", registerValidation, register);
router.post("/refresh_token", refreshToken);

module.exports = router;
