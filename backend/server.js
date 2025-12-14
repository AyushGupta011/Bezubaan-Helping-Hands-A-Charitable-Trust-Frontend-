import express from "express"
import dotenv from "dotenv"
import connectDB from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import contactRoutes from './routes/contactRoutes.js'
import volunteerRoutes from './routes/volunteerRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
dotenv.config();
connectDB();


const app=express();
app.use(cors({
    origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/', (req, res) => res.send('Bezubaan Backend is running'));


app.use('/contact', contactRoutes);
app.use('/volunteer',volunteerRoutes)
app.use('/report', reportRoutes);
app.use('/donations', donationRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`));