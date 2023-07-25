const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

taskSchema.methods.toJSON = function(){
    const tasks = this
    const tasksObject = tasks.toObject()
    delete tasksObject.owner
    return tasksObject
}

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = Tasks