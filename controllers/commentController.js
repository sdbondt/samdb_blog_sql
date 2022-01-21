const pool = require('../db')
const asyncHandler = require('../errorhandlers/asyncHandlers')
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errorhandlers/customError');

exports.createComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { id } = req.params
    const userId = req.user.id
    const result = await pool.query('INSERT INTO comments (content, creator, post) VALUES ($1, $2, $3) RETURNING *;', [content, userId, id,])
    const comment = result.rows[0]
    res.status(StatusCodes.CREATED).json({ data: comment })
})

exports.getComments = asyncHandler(async (req, res) => {
    const { id } = req.params
    const num = parseInt(id)
    const results = await pool.query('SELECT * FROM comments WHERE post = $1;', [num])
    const { rows } = results
    res.status(StatusCodes.OK).json({ data: rows, count: rows.length })
})

exports.getComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params
    const numPostId = parseInt(id)
    const numCommentId = parseInt(commentId)
    const result = await pool.query('SELECT * FROM comments WHERE id = $1 AND post = $2;', [numCommentId, numPostId])
    const comment = result.rows[0]
    res.status(StatusCodes.OK).json({ data: comment })
})

exports.updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { commentId } = req.params
    const numCommentId = parseInt(commentId)
    if (content) {
        const result = await pool.query('UPDATE comments SET content = $1 WHERE id = $2 RETURNING *;', [content, numCommentId])
        const comment = result.rows[0]
        res.status(StatusCodes.OK).json({ data: comment })
    }

})

exports.deleteComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params
    const numPostId = parseInt(id)
    const numCommentId = parseInt(commentId)
    const result = await pool.query('DELETE FROM comments WHERE id = $1 AND post = $2 RETURNING *;', [numCommentId, numPostId])
    const comment = result.rows[0]
    res.status(StatusCodes.OK).json({ data: comment })
})