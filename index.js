require('dotenv').config()
const express = require('express')
const cors = require('cors')

// errors and non existing routes
const notFoundHandler = require('./errorhandlers/notFoundHandler')
const errorHandler = require('./errorhandlers/errorHandler')

// routes
const authRoutes = require('./routers/authRouter')
const postRoutes = require('./routers/postRouter')
const auth = require('./utils/auth')

const app = express()
const PORT = process.env.PORT

// middelware
app.use(express.json())
app.use(cors())

//routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', auth, postRoutes)

// errors and non existing routes
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`...listening on PORT ${PORT}...`);
})