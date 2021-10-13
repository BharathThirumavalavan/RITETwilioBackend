const express = require('express')
const router = require('./routers/router')

require('dotenv').config()

const app = new express()
const port = process.env.PORT
const connectDB = require('./mongoDB/mongoConnect')
app.use(express.json())

app.use('/login', router)
// app.use(cors())

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, console.log(`Server Listening to the port ${port}...`))
  } catch (err) {
    console.log(err)
  }
}

start()
