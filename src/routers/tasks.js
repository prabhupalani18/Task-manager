const express = require("express")
const router = new express.Router()
const Tasks = require("../models/tasks")

router.post('/tasks', async (req,res)=>{
    try{
        const task = new Tasks(req.body)
        await task.save()
        res.status(201).send()
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/tasks', async(req,res)=>{
    try{
        const tasks = await Tasks.find({})
        if(!tasks){
            return res.status(404).send()
        }
        
        res.send(tasks)
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req,res)=>{
    try{
        const _id = req.params.id
        const task = await Tasks.findById(_id)
        if(!task)
        {
            return res.status(404).send()
        }

        res.send(task)
    }catch(error)
    {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async(req,res)=>{
    try{
        const allowedKeys = ["description", "completed"]
        const requestKeys = Object.keys(req.body)
        const allowUpdateFlag = requestKeys.every((key) => allowedKeys.includes(key))
        if(!allowUpdateFlag)
        {
            return res.status(400).send({"error": "invalid keys found"})
        }
        const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task)
        {
            return res.status(404).send()
        }
        
        res.send(task)
    }catch(error){
        res.status(500).send(error)
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
        res.status(500).send(error)
    }
})

module.exports = router