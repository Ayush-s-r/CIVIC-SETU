const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect =  require("../middleware/authMiddleware")

const router = express.Router();

//@route POST /api/users/register
//@desc create user
//@access public

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ messege: "user already exists" });

    user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    //JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // sign and return token along user data

    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//@route POST /api/users/login
//@desc authenticate user
//@access public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await user.matchPassword(password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //JWT payload
    const payload = { user: { id: user._id, role: user.role } };
    // sign and return token along user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error(err)
    res.status(500).send("Server Error" );
  }
});




//@route GET /api/users/profile
//@desc get logged in users profile
//@access private

router.get("/profile", protect,  async (req,res) => {
  res.json(req.user)


  
})

module.exports = router;
