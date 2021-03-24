const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function isPasswordCorrect(password, hash) {
    return bcrypt.compareSync(password, hash)
}
const SECRET_KEY = "KAROL NOWAKOWSKI"
function generateAuthorizationToken(user) {
    const payload = {
        sub: user.id
    };
    const options = {
        expiresIn: "15m"
    }
    return jwt.sign(payload, SECRET_KEY, options);
}
function getUserIdFromToken(token) {
    const payload = jwt.verify(token, SECRET_KEY);
    console.log(payload)
    return payload.sub
}

const auth = {
    hashPassword,
    isPasswordCorrect,
    generateAuthorizationToken,
    getUserIdFromToken
};

module.exports = auth;