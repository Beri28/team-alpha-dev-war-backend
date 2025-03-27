import express from 'express';
import dotenv from 'dotenv';
import connectdb from './database/connectdb.js';
import jobRoutes from './routes/job.route.js';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';
import cors from 'cors'
import {initiatePay,paymentStatus} from './controller/payment.js'

// Routes
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import verificationRouter from './routes/verification.route.js';

// Middleware
import errorMiddleware from './middleware/error.middleware.js';

// Configurations
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const fs = require('fs');

const app = express();

// Create upload directories if they don't exist
const uploadDirs = [
  path.join(__dirname, 'uploads'), 
  path.join(__dirname, 'uploads/ids'),
  path.join(__dirname, 'uploads/selfies')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors({
  origin:'http://localhost:5173' //make sure to change when hosting
}))
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(express.static('frontend/dist'))
app.use(express.static('frontend/public'))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/verification', verificationRouter);

app.use('/api/v1/job', jobRoutes);

// payment///////////////////////////////////////////////////////////
app.post('/api/v1/payment_status',async (req, res) => {
  console.log(req.body)
  let resp=await paymentStatus(req.body.paymentId)
  res.json(resp);
});
app.post('/api/v1/initiate-pay',async (req, res) => {
  console.log(req.body)
  const payment = {...req.body}
  console.log(payment.amount)
  let resp=await initiatePay(payment)
  res.json(resp);
  // res.json({message:'Post success'})
});
app.use('*',(req,res)=>{
  res.sendFile('index.html',{root:'./frontend/dist'})
})
 
// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Welcome to Freelance App API',
    timestamp: new Date(),
    routes: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      verification: '/api/v1/verification'
    }
  });
});

// Error Handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  await connectdb();
});