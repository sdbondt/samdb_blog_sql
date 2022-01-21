const pool = require("../db");
const asyncHandler = require("../errorhandlers/asyncHandlers");
const { hashPw, getJWT, comparePW } = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errorhandlers/customError')

exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPw = await hashPw(password);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
    [name, email, hashedPw]
  );
  const token = getJWT(newUser.rows[0]);
  res.status(StatusCodes.CREATED).json({ token, user: newUser.rows[0] });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const users = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
    
  if (users.rows.length === 0) {
    throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    }
    const user = users.rows[0]
    const isValid = await comparePW(password, user)
    
    if (!isValid) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    } else {
        const token = getJWT(user)
        res.json({ token, user })
    }

});

exports.getProfile = asyncHandler(async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user})
})
