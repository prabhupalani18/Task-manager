const express = require("express")
const router = new express.Router()
const Tasks = require("../models/tasks")
const auth = require("../middleware/auth")

router.post('/tasks', auth, async (req,res)=>{
    try{
        const task = new Tasks({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send()
    }catch(error){
        res.status(400).json({ error: error.message })
    }
})

router.get('/tasks/me', auth, async(req,res)=>{
    try{
        const tasks = await Tasks.find({owner: req.user._id})
        if(!tasks){
            return res.status(404).send()
        }
        
        res.send(tasks)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    try{
        const _id = req.params.id
        const task = await Tasks.findOne({_id, "owner": req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }

        res.send(task)
    }catch(error)
    {
        res.status(500).json({ error: error.message })
    }
})

router.patch('/tasks/:id', async(req,res)=>{
        const allowedKeys = ["description", "completed"]
        const requestKeys = Object.keys(req.body)
        const allowUpdateFlag = requestKeys.every((key) => allowedKeys.includes(key))
        if(!allowUpdateFlag)
        {
            return res.status(400).send({"error": "invalid keys found"})
        }
        try{
        let task = await Tasks.findById(req.params.id)
        if(!task)
        {
            return res.status(404).send()
        }
        
        requestKeys.forEach((update)=> task[update] = req.body[update])
        task = await task.save()
        
        res.send(task)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
})

router.delete('/tasks/:id', async(req,res)=>{
    try{
        const task = await Tasks.findByIdAndDelete(req.params.id)
        if(!task)
        {
            return res.status(404).send()
        }

        res.send(task)
    }catch(error)
    {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router