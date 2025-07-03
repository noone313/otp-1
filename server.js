import express from 'express';
// import { startServer } from './models/models.js';
import cookieParser from 'cookie-parser';
import { connectRedis } from './redis.client.js';
import otpRoutes from './routes/otp.route.js';




const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1/otp', otpRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});




connectRedis();
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

