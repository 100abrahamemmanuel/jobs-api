require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
//Router
// for the authenticetion (auth.js in routes)
const authRouter = require('./routes/auth')
// for the jobs route (jobs.js in routes)
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs:15*60*1000,// i5 minutes
  max:100,// limit each ip to 100 request per windowMs(15mins)
}))
app.use(express.json());
app.use(helmet)
app.use(cors)
app.use(xss)

// simple route
app.get('/',(req,res)=>{
  res.send('api')
})
// routes
// domain/api/v1/auth/register  &   domain/api/v1/auth/register && domain/api/v1/jobs  &   domain/api/v1/jobs/:id
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
