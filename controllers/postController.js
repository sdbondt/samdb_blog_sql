const pool = require('../db')
const asyncHandler = require('../errorhandlers/asyncHandlers')
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errorhandlers/customError');



exports.getPosts = asyncHandler(async (req, res) => {
    const obj = await pool.query('SELECT * FROM posts;')
    const { rows } = obj
    res.status(StatusCodes.OK).json({ data: rows, count: rows.length })
})

exports.getPost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const num = parseInt(id)
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [num])
    const { rows } = result
    if (rows.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No post with this id.')
    } else {
        const post = rows[0]
        res.status(StatusCodes.OK).json({ data: post })
    }
    
})

exports.createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body
    const creator = parseInt(req.user.id)
    const result = await pool.query('INSERT INTO posts (title, content, creator) VALUES ($1, $2, $3) RETURNING *;', [title, content, creator])
    const post = result.rows[0]
    res.status(StatusCodes.CREATED).json({ data: post})
})

exports.updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const num = parseInt(id)
    const { title, content } = req.body
    let sqlQuery = ''
    if (title && content) {
        sqlQuery = pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;', [title, content, num])
    } else if (title) {
        sqlQuery = pool.query('UPDATE posts SET title = $1 WHERE id = $2 RETURNING *;', [title, num])
    } else if (content) {
        sqlQuery = pool.query('UPDATE posts SET  content = $1 WHERE id = $2 RETURNING *;', [content, num])
    }
    const result = await sqlQuery
    const post = result.rows[0]
    res.status(StatusCodes.OK).json({ post })
})

exports.deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const num = parseInt(id)
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [num])
    const post = result.rows[0]
    res.status(StatusCodes.OK).json({ data: post })
})