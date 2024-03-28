import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})


const Task = mongoose.model('Task', taskSchema)

export default Task;
