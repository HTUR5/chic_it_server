import express from 'express';
import * as get_functions from "../model/get_functions.js"

const getRouter = express.Router()

//for showing user details in profilefragment
getRouter.get('/getUserDetails', async(req, res) =>{
    const user = await get_functions.getUser(req.query.uid)
    //console.log(user)
    if (user.length === 0){
      return res.status(404).send()
    }
    return res.status(200).send(user)
  })
  
getRouter.get('/getPostDetails', async(req, res) =>{
    const post = await get_functions.getPostDetails(req.query.pid)
    //console.log(post)
    if (post.length === 0){
      return res.status(404).send()
    }
    return res.status(200).send(post)
  })

//count posts of each user
getRouter.get('/countPost', async(req, res) =>{
    const countPosts = await get_functions.countPost(req.query.uid)
    //console.log(countPosts)
    if (countPosts.length === 0){
      return res.status(404).send()
    }
    res.status(200).send(countPosts.toString());
})

getRouter.get('/check', async(req, res) =>{
    const isSaved = await get_functions.check(req.query.uid, req.query.pid)
    if (isSaved.length === 0){
      return res.status(404).send()
    }
    res.status(200).send(isSaved);
})

//get all the categories
getRouter.get('/getMyPhoto', async(req, res) =>{
    const postsList = await get_functions.getMyPhoto(req.query.uid)
    //console.log(postsList)
    if (postsList.length === 0){
      return res.status(404).send()
    }
    return res.status(200).send(postsList)
})

getRouter.get('/mySavedPosts', async(req, res) =>{
    const postsList = await get_functions.mySavedPosts(req.query.uid)
    //console.log(postsList)
    if (postsList.length === 0){
      return res.status(404).send()
    }
    return res.status(200).send(postsList)
})

getRouter.get('/homePosts', async(req, res) =>{
    const postsList = await get_functions.homePosts()
    //console.log(postsList)
    if (postsList.length === 0){
      return res.status(404).send()
    }
    return res.status(200).send(postsList)
})





export { getRouter }
