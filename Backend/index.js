import dotenv from 'dotenv'
import connectDB from "./src/db/index.js"
import { app } from "./app.js"


dotenv.config({
    path:'./.env'
})

connectDB()
.then(() => {
    app.on('error' , (err) => {
        console.log('Mongodb connection successful, but Express is not listening!', err)
    throw err;
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log(`Mongodb connection failed ${error}`);
})

