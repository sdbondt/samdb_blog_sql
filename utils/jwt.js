require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.hashPw = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);
    return hashedPW
}

exports.getJWT = (user) => {
    return jwt.sign(
        { userId: user.id, userName: user.name },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    )
}

exports.comparePW = async (password, user) => {
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch
}



