const request = require("supertest")
const Task = require("../src/models/tasks")
const app = require("../src/app")

const { userTwo, 
        userTwoId, 
        userThree, 
        userThreeId, 
        taskOne, 
        taskTwo, 
        taskThree, 
        setupDatabase } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create a new task", async()=>{
    const response = await request(app)
        .post('/tasks')
        .set('authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: "say hello",
        })
    
    expect(response.statusCode).toBe(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Should get all task for userTwo", async()=>{
    const response = await request(app)
        .get('/tasks')
        .set('authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toEqual(2)
})

test("Should not delete other users task", async()=>{
    const response = await request(app)
        .delete('/tasks')
        .set('authorization', `Bearer ${userThree.tokens[0].token}`)
        .send({
            owner: userThree._id,
            _id: taskOne._id
        })
    
    expect(response.statusCode).toBe(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})