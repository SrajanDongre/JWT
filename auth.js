var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const saltRounds = 10;
const secretKey = 'dsaafdfdnvjf'

async function hashPassword(password){
    var salt = await bcrypt.genSalt(saltRounds); 
    console.log(salt);
    var hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
};

async function hashCompare(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword)
}

let createToken = async(data)=>{
    let token = await jwt.sign(data,secretey,{expiresIn:'1m'})
    return token
}



let validate = async(req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token)
    if(Math.round((+new Date)/1000)<data.exp)
    {
        next()
    }
    else
    {
        res.send({
            statusCode:401,
            message:"Invalide Token or Token Expired"
        })
    }

}

let roleAdmin = async (req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token);
    if(data.role=='admin')
    {
        next()
    }
    else
    {
        res.send({
            statusCode:401,
            message:"Only admin can access this"
        })
    }
}

let roleStudent = async (req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token);
    if(data.role=='student')
    {
        next()
    }
    else
    {
        res.send({
            statusCode:401,
            message:"Only admin can access this"
        })
    }
}


module.exports = {hashPassword,hashCompare,createToken,validate,roleAdmin,roleStudent}