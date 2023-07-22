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

app.get('/users', (req,res)=>{
    User.find({}).then((users)=>{
        res.send(users)
    }).catch(error =>{
        res.status(500).send(error)
    })
})

app.get('/users/:id', (req,res)=>{
    const _id = req.params.id
    User.findById(_id).then(user=>{
        if(!user){
            return res.status(404).send()
        }
        
        res.send(user)
    }).catch(error=>{
        res.status(500).send(error)
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

app.get('/tasks', (req,res)=>{
    Tasks.find({}).then(tasks=>{
        res.send(tasks)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

app.get('/tasks/:id', (req,res)=>{
    const _id = req.params.id
    Tasks.findById(_id).then(task=>{
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`)
})