const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/users")
const Task = require("../../src/models/tasks")

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    "_id": userTwoId,
    name: 'Prabhu',
    age: 25,
    email: 'sriprabhu@example.com',
    password: 'MyWorld2!!',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const userThreeId = new mongoose.Types.ObjectId()

const userThree = {
    "_id": userThreeId,
    name: 'Sri',
    age: 25,
    email: 'sri@example.com',
    password: 'MyWorld4!!',
    tokens: [{
        token: jwt.sign({_id: userThreeId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: "First task",
    completed: true,
    owner: userTwo._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: "Second task",
    completed: false,
    owner: userTwo._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: "Third task",
    completed: true,
    owner: userThree._id
}

const setupDatabase = async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userTwo).save()
    await new User(userThree).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userTwo,
    userTwoId,
    userThree,
    userThreeId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}