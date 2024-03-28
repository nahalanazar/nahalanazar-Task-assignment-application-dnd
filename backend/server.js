import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

dotenv.config()
connectDB() 

app.use(express.json()) 

app.get('/', (req, res) => {
    res.send("Application is running")
})

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`server started on port ${PORT}`))


import("socket.io").then((socketIO) => {
    const io = new socketIO.Server(server, {
        pingTimeout: 60000, 
        cors: {
            origin: "http://localhost:3000"
        }
    });
     
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('taskAdded', (newTask) => {
            socket.broadcast.emit('taskAdded', newTask);
        });

        socket.on('taskUpdated', (updatedTask) => {
            io.emit('taskUpdated', updatedTask);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    
}).catch((error) => {
    console.error("Error importing socket.io:", error);
});