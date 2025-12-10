import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/api'
import  connectDb  from './utils/database'
import docs from './docs/route'
import cors from 'cors'


async function init(){
    try {
        
        const PORT = 3000
        const result = await connectDb()

        console.log("database status:", result)

        
        const app = express()
        app.use(cors())
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.get("/", (req, res)=> {
            res.status(200).json({
                message: "Server is running",
                data: null
            })
        })

        app.use('/api', router)
        docs(app)

        app.listen(PORT, ()=> {
            console.log(`server is running on http://localhost:${PORT}`)
        });
    } catch (error) {
        console.log(error)
    }
}

init()

