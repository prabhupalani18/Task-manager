const express = require("express")
const router = new express.Router()
const User = require('../models/users')
const auth = require("../middleware/auth")
const multer = require("multer")

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error("Please upload an image"))
        }

        cb(null, true)
    }
})

router.post('/users', async(req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error)
    {
        return res.status(400).send(error.message)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            return res.status(404).send()
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        const user = req.user
        user.tokens = user.tokens.filter((tokenObject)=> {
            return tokenObject.token !== req.token
        })
        await user.save()
        res.send("User logged out")
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
    try{
        const user = req.user
        user.tokens = []
        await user.save()
        res.send("Logged out from all sessions")
    }catch(error)
    {
        res.status(500).send(error.message)
    }
})

router.get('/users/me', auth, async(req,res)=>{
    res.send(req.user)
})

router.get('/users/:id', async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        if(!user)
        {
            return res.status(404).send()
        }

        res.send(user)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.patch('/users/me', auth, async(req,res)=>{
        const requestKeys = Object.keys(req.body)
        const allowedKeys = ["name", "email", "password", "age"]
        const allowUpdateFlag = requestKeys.every((key)=> allowedKeys.includes(key))
        if(!allowUpdateFlag)
        {
            return res.status(400).send({"error":"Invalid keys found"})
        }
        try{
        requestKeys.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    }catch(error)
    {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/users/me', auth, async(req,res)=>{
    try{
        await User.deleteOne(req.user._id)
        res.send(req.user)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
        return res.status(400).send({"error": error.message})
})

router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({"error": error.message})
})

module.exports = router