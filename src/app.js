const express = require("express")
const app = express()
require("./db/mongoose")
const User = require("./models/users")
const Tasks = require("./models/tasks")

app.use(express.json())

const port = process.env.PORT || 3000

app.post('/users', (req,res)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.post('/tasks', (req,res)=>{
    const task = new Tasks(req.body)
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`)
})