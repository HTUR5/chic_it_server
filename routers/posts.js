import express from 'express';
import * as post_functions from "../model/post_functions.js"
import bodyParser from "body-parser"

const postRouter = express.Router()

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
postRouter.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
postRouter.use(bodyParser.json());

//add new user to the database
postRouter.post('/addUser', async (req, res) => {
    console.log("you are here");
    const ans = await post_functions.addUser(req.body.username, req.body.fullName, req.body.email, req.body.phone, req.body.password)
    if (ans.length === 0 ) {
    return res.status(404).send()
    }
    return res.status(200).send("done")
})


export { postRouter }