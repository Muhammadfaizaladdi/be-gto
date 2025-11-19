import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/api'
import  connectDb  from './utils/database'

async function init(){
    try {
        
        const result = await connectDb()

        console.log("database status:", result)

        
        const app = express()
        app.use(bodyParser.json())
        app.get("/", (req, res)=> {
            res.status(200).json({
                message: "Server is running",
                data: null
            })
        })

        const PORT = 3000
        app.use('/api', router)

        app.listen(PORT, ()=> {
            console.log(`server is running on http://localhost:${PORT}`)
        });
    } catch (error) {
        console.log(error)
    }
}

init()

