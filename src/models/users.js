const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const expiresIn = process.env.TOKEN_EXPIRATION_DURATION
const secretKey = process.env.SECRETKEY
const Tasks = require("../models/tasks")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw new Error('password should not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0)
            {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userProfile = user.toObject()
    delete userProfile.password
    delete userProfile.tokens
    return userProfile
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign( { _id: user._id.toString() }, secretKey, {expiresIn})
    user.tokens = user.tokens.concat({ "token": token})
    await user.save()
    return token
}

//Authenticate user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
  
    return user;
  };

//Bcrypt password before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete tasks when user is deleted
userSchema.pre('deleteOne', async function(next){
    const user = this
    await Tasks.deleteMany({owner: user._conditions._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User