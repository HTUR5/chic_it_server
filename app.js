import express from 'express';
import { getRouter } from "./routers/gets.js"
import { postRouter } from "./routers/posts.js"

const app = express()
app.use(postRouter)
app.use(getRouter)
// app.use(express.static('routers'))

const server = app.listen(3000, () => {
  console.log("Listening on port 3000...")
})

server.on('connection', (socket) => {
  console.log('A client connected to the server.')
})
