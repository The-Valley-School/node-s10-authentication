const bcrypt = require("bcrypt");
const { User } = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAuth };
