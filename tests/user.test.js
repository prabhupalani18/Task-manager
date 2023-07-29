const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/users")

const { userTwo, userTwoId, setupDatabase } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should sign up a new user", async()=>{
    const userOne = {
        name: 'Prabhu',
        age: 25,
        email: 'prabhu@example.com',
        password: 'MyWorld2!!'
    }
    const response = await request(app).post('/users').send(userOne)
    expect(response.statusCode).toBe(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Prabhu',
            email: 'prabhu@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyWorld2!!')
})

test("Should not signup, required field not passed", async()=>{
    const response = await request(app).post('/users').send({})
    expect(response.statusCode).toBe(400)
})

test("Should login existing user", async()=>{
    const response = await request(app).post('/users/login').send(userTwo)
    expect(response.statusCode).toBe(200)

    //Assertion for second token
    const user = await User.findById(userTwoId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should throw error for invalid user login data", async()=>{
    const response = await request(app).post('/users/login').send({
        email: userTwo.email,
        password: 'invalidData'
    })
    expect(response.statusCode).toBe(500)
})

test("Should get profile for user", async()=>{
    const response = await request(app).get('/users/me').set('authorization', `Bearer ${userTwo.tokens[0].token}`).send()
    expect(response.statusCode).toBe(200)
})

test("Should not get profile for unauthenticated user", async()=>{
    const response = await request(app).get('/users/me').send()
    expect(response.statusCode).toBe(401)
})

test("Should delete account for user", async()=>{
    const response = await request(app).delete('/users/me').set('authorization', `Bearer ${userTwo.tokens[0].token}`).send()
    expect(response.statusCode).toBe(200)

    const user = await User.findById(userTwoId)
    expect(user).toBeNull()
})

test("Should not delete account for unauthenticated user", async()=>{
    const response = await request(app).delete('/users/me').send()
    expect(response.statusCode).toBe(401)
})

test("Should upload avatar image", async()=>{
    const response = await request(app)
        .post('/users/me/avatar')
        .set('authorization', `Bearer ${userTwo.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/sample.jpg')
        
    expect(response.statusCode).toBe(200)

    const user = await User.findById(userTwoId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid fields", async()=>{
    const response = await request(app)
        .patch('/users/me')
        .set('authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            name: 'Prabhu Palani'
        })

    const user = await User.findById(userTwoId)
    expect(user.name).toBe('Prabhu Palani')
})

test("Should not update for invalid user fields", async()=>{
    const response = await request(app)
        .patch('/users/me')
        .set('authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            location: 'chennai'
        })
    
    expect(response.statusCode).toBe(400)
})