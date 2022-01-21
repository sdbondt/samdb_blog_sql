const express = require('express')
const {  getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController')
const router = express.Router()
const commentRouter = require('./commentRouter')

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', createPost)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)
router.use('/:id/comments', commentRouter)

module.exports = router