import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../config/generateToken.js'
import Task from '../models/taskModel.js'

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {  
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const authUser = asyncHandler(async (req, res) => {
   
    const { email, password } = req.body
     if ( !email || !password ) {
        res.status(401);
        throw new Error('Email or Password is missing in the request, User authentication failed.');
    }
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        

        let registeredUserData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }

        res.status(201).json(registeredUserData)
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

const createTask = asyncHandler(async (req, res) => {
    const { task, status } = req.body;

    const newTask = await Task.create({
        task,
        status
    });

    if (newTask) {
        res.status(201).json(newTask);
    } else {
        res.status(400);
        throw new Error('Invalid task data');
    }
});

const showTask = asyncHandler(async (req, res) => {

    const tasks = await Task.find({})

    if (tasks) {
        res.status(201).json({tasks});
    } else {
        res.status(400);
        throw new Error('No task found');
    }
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await Task.findById(taskId);

  if (task) {
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});


export {
    authUser,
    registerUser,
    createTask,
    showTask,
    updateTaskStatus
}