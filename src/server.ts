import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import residenceRoutes from './routes/residenceRoutes';
import categoryRoutes from './routes/categoryRoutes';
import programRoutes from './routes/programRoutes';
import bitacoraRoutes from './routes/bitacoraRoutes';
import activityRoutes from './routes/activityRoutes';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import { startCronJobs } from './config/cron';
import path from 'node:path';

dotenv.config();
connectDB();
startCronJobs();
const app = express();

app.use(cors(/* corsConfig */));

// Logging
app.use(morgan('dev'))

// Leer datos de formularios
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/residences', residenceRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/bitacoras', bitacoraRoutes)
app.use('/api/activities', activityRoutes)

//Imagenes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;