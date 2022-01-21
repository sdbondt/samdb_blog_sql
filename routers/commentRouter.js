const express = require('express')
const { getComments, getComment, createComment, updateComment, deleteComment } = require('../controllers/commentController')
const router = express.Router({ mergeParams: true })

router.get('/', getComments)
router.get('/:commentId', getComment)
router.post('/', createComment)
router.patch('/:commentId', updateComment)
router.delete('/:commentId', deleteComment)

module.exports = router