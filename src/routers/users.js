const express = require("express")
const router = new express.Router()
const User = require('../models/users')

router.post('/users', async(req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).send()
    }catch(error){
        res.status(400).json({ error: error.message })
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.get('/users', async(req,res)=>{
    try{
        const users = await User.find({})
        if(!users)
        {
            return res.status(404).send()
        }

        res.send(users)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
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