const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");
const verifyToken = require("./verifyToken");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    password,
  });
  user.password = await user.encryptPassword(user.password);
  await user.save();

  const token = jwt.sign({ id: user._id }, config.secrete, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  //console.log(email, password);
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("the email doesn't exist");
  }
  const validatePassword = await user.validatePassword(password);
  if (!validatePassword) {
    return res.status(401).json({
      auth: false,
      token: null,
    });
  }
  const token = jwt.sign({ id: user._id }, config.secrete, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

router.get("/profile", verifyToken, async (req, res, next) => {
  const user = await User.findById(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).send("No user found");
  }
  res.json(user);
});

router.get("/dashboard", verifyToken, (req, res, next) => {
  res.json("dashboard");
});

module.exports = router;
