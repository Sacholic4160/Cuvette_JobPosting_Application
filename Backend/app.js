import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import companyRouter from './src/routers/company.route.js'
import jobRoute from './src/routers/job.route.js'
import dotenv from 'dotenv'
import bodyParser from "body-parser"

dotenv.config({
    path: './.env'
})


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'20kb' }));
app.use(cookieParser());
app.use(bodyParser())

app.use('/company',companyRouter)
app.use('/job', jobRoute)

export {app}