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
    const userDetal = {
        id: user.id,
        name: user.name,
        email: user.email,
        info: user.info,
        avatar: user.avatar
    }
    const payload = {
        sub: user.id,
        currentUser: userDetal
        
    };
    const options = {
        expiresIn: "15m"
    }
    return jwt.sign(payload, SECRET_KEY, options); 
}


function getUserIdFromToken(token) {
    const payload = jwt.verify(token, SECRET_KEY);
    console.log(payload)
    console.log( payload.currentUser.avatar.color)
    return payload.sub
}

function authenticateRequest(req, db) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    if (!authHeader.startsWith("Bearer ")) {
        console.log("Invalid header")
        return null;
    }
    const token = authHeader.substring(7, authHeader.length);
    try {
        const userId = getUserIdFromToken(token);
        db.findResourceByIdAndType(userId, "User"); //dany uzytkownik istnieje w bazie danych
        return userId;
    } catch (error) {
        console.info(error);
        return null;
    }
    
}

const auth = {
    hashPassword,
    isPasswordCorrect,
    generateAuthorizationToken,
    getUserIdFromToken,
    authenticateRequest
};

module.exports = auth;