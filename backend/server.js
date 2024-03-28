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
 
const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`server started on port ${PORT}`));