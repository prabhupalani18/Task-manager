const express = require("express")
const router = new express.Router()
const User = require('../models/users')
const auth = require("../middlleware/auth")

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

router.patch('/users/:id', async(req,res)=>{
        const requestKeys = Object.keys(req.body)
        const allowedKeys = ["name", "email", "password", "age"]
        const allowUpdateFlag = requestKeys.every((key)=> allowedKeys.includes(key))
        if(!allowUpdateFlag)
        {
            return res.status(400).send({"error":"Invalid keys found"})
        }
        try{
        let user = await User.findById(req.params.id)
        if(!user)
        {
            return res.status(404).send()
        }

        requestKeys.forEach((update)=> user[update] = req.body[update])
        user = await user.save()
        
        res.send(user)
    }catch(error)
    {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/users/:id', async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user)
        {
            return res.status(404).send()
        }

        res.send(user)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})


module.exports = router