const bcrypt = require("bcrypt");

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function isPasswordCorrect(password, hash) {
    return bcrypt.campareSync(password, hash)
}

const auth = {
    hashPassword,
    isPasswordCorrect
};

module.exports = auth;