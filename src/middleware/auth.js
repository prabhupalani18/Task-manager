const jwt = require("jsonwebtoken")
const User = require("../models/users")

const auth = async(req,res,next)=>{
    try{
        const authToken = req.headers['authorization'].replace('Bearer ','')
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': authToken})
        if(!user){
            throw new Error()
        }
        req.token = authToken
        req.user = user
        next()
    }catch(error){
        res.status(401).send("Please authenticate")
    }
}

module.exports = auth