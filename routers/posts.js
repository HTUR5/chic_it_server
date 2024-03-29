import express from 'express';
import * as post_functions from "../model/post_functions.js"
import bodyParser from "body-parser"

const postRouter = express.Router()

postRouter.use(bodyParser.urlencoded({
  extended: true
}));

postRouter.use(bodyParser.json());

//add new user to the database
postRouter.post('/addUser', async (req, res) => {
    const ans = await post_functions.addUser(req.body.username, req.body.fullname, req.body.email, req.body.phone, req.body.password)
    if (ans.length === 0 ) {
    return res.status(404).send()
    }
    return res.status(200).send("done")
})

postRouter.post('/editProfile', async (req, res) => {
  const ans = await post_functions.editProfile(req.body.uid, req.body.gender, req.body.size, req.body.username, req.body.fullname, req.body.imageurl)
  if (ans.length === 0 ) {
  return res.status(404).send()
  }
  return res.status(200).send("done")
})

postRouter.post('/deletePost', async (req, res) => {
  const ans = await post_functions.deletePost(req.body.pid, req.body.publisher, req.body.uid)
  if (ans.length === 0 ) {
  return res.status(404).send()
  }
  return res.status(200).send("done")
})

postRouter.post('/savePost', async (req, res) => {
  const ans = await post_functions.savePost(req.body.uid, req.body.pid)
  if (ans.length === 0 ) {
  return res.status(404).send() 
  }
  return res.status(200).send("done")
})

postRouter.post('/followUser', async (req, res) => {
  const ans = await post_functions.followUser(req.body.uid,req.body.pid)
  if (ans.length === 0 ) {
  return res.status(404).send()
  }
  return res.status(200).send("done")
})

//upload post
postRouter.post('/addPost', async (req, res) => {
  console.log(req.body.items)
  const ans = await post_functions.addPost(req.body.imageurl, req.body.uid, req.body.items, req.body.type)
  if (ans.length === 0 ) {
  return res.status(404).send()
  }
  return res.status(200).send("done")
})

export { postRouter }

