
const validator = require("validator");
function validateUsername(username) {return validator.isAlphanumeric(username, 'en-US', {ignore: '-_'});}
function validatePassword(password){
  return   validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
        returnScore: false,
    })
}
function validateEmail(email){
   return validator.isEmail(email)
}
function validateAll(username, email, password, res){
    if (!validateUsername) {
        return res.status(400).json({error: 'Invalid username format use only characters and numbers'});
    } else if (!validateEmail(email)) {
        return res.status(400).json({error: 'Invalid email format'});
    } else if (!validatePassword(password)) {
        return res.status(400).json({error: 'Invalid password format at least 8 characters with lower and uppercase'});
    }
}
function validatelogin(loginInput,password,res){
    if (!validateUsername(loginInput) && !validateEmail(loginInput)) {
        return res.status(400).json({error: 'Invalid email or username format'});
    } else if (!validatePassword(password)) {
        return res.status(400).json({error: 'Invalid password'});
    }
    else if (validateUsername(loginInput)){
        return "it's a username"
    }
    else if (validateEmail(loginInput)){
        return "it's an email"
    }
}

module.exports={validateSignin,validateAll}