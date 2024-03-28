import express from "express";
const router = express.Router()
import {
    authUser,
    registerUser,
    createTask,
    showTask,
    updateTaskStatus
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post('/register', registerUser)
router.post('/login', authUser)
router.post('/createTask', protect, createTask)
router.get('/showTask', showTask)
router.put('/:taskId', updateTaskStatus)


export default router