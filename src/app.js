const express = require("express")
const app = express()
require("./db/mongoose")

const userRouter = require("./routers/users")
const taskRouter = require("./routers/tasks")

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app