// mkdir express_blog
// cd express_blog
// npm install express --save
// node my-server.js

// save following contents into my-server.json

const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json());
const port = 3000

const http = require('http')
const fs = require('fs')

app.use(express.static(path.join(__dirname, '', 'build')))

let postsData = {
    "count": 2,
    "posts": [
        {
            "id": "1",
            "title": "My first post",
            "content": "Yay!"
        },
        {
            "id": "2",
            "title": "My second post",
            "content": "Yay!"
        }
    ]
}

let commentsData = [
    {
        postId: "1",
        name: "Batman",
        comment: "Nice post"
    },
    {
        postId: "2",
        name: "Batman",
        comment: "Also nice post"
    },
    {
        postId: "1",
        name: "Superman",
        comment: "I do not agree"
    },
]

app.get('/posts', (_req, res) => {
    res.json(postsData)
})

app.post('/add-comment', (req, res) => {
    console.log("Received post on /add-comment", req.body)
    commentsData.push(req.body);
    res.json(postsData)
})

app.get('/post/:postId', (req, res) => {
    res.json(postsData.posts.find(x => x.id == req.params.postId))
})

app.get('/post/:postId/comments', (req, res) => {
    res.json(commentsData.filter(x => x.postId == req.params.postId))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '', 'build', 'index.html'))
})