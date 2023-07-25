
const validator = require("validator");
function validateSignin(username, email, password, res){
    if (!validator.isAlphanumeric(username, 'en-US', {ignore: '-_'})) {
        return res.status(400).json({error: 'Invalid username format use only characters and numbers'});
    } else if (!validator.isEmail(email)) {
        return res.status(400).json({error: 'Invalid email format'});
    } else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
        returnScore: false,
    })) {
        return res.status(400).json({error: 'Invalid password format at least 8 characters with lower and uppercase'});
    }
}
function validatelogin(loginInput,password,res){
    if (!validator.isAlphanumeric(loginInput, 'en-US', {ignore: '-_'}) && !validator.isEmail(loginInput)) {
        return res.status(400).json({error: 'Invalid email or username format'});
    } else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
        returnScore: false,
    })) {
        return res.status(400).json({error: 'Invalid password'});
    }
    else if (validator.isAlphanumeric(loginInput, 'en-US', {ignore: '-_'})){
        return "it's a username"
    }
    else if (validator.isEmail(loginInput)){
        return "it's an email"
    }
}
module.exports={validateSignin,validatelogin}