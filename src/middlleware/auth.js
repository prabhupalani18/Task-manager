const jwt = require("jsonwebtoken")
const User = require("../models/users")
require("dotenv").config()

const auth = async(req,res,next)=>{
    try{
        const authToken = req.headers['authorization'].replace('Bearer ','')
        const decoded = jwt.verify(authToken, process.env.SECRETKEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': authToken})
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(error){
        res.status(401).send("Please authenticate")
    }
}

module.exports = auth