const express = require('express')
const router = express.Router()
const pgserv = require('../../database/bddconfig')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post('/', (req, res, next) => {
    const data = {
        dateD: req.body.dateD,
        dateF: req.body.dateF,
        nSource: req.body.nSource,
        dSource: req.body.dSource
    }
    const duration = `AND (duration BETWEEN ${req.body.durationM} AND ${req.body.durationMx})`
    const callStatus = [req.body.answered, req.body.noanswer, req.body.busy]
    const callLabel = ['ANSWERED', 'NO ANSWER', 'BUSY']
    var call = ''
    var source = ''
    var destination = ''
    var trueOne = false
    for (var i = 0; i < 3; i++)
    {
        if (!trueOne)
        {
            if (callStatus[i])
            {
                call += `AND disposition LIKE '${callLabel[i]}'`
                trueOne = true
            }
        } else {
            if (callStatus[i])
            {
                call += ` OR disposition LIKE '${callLabel[i]}'`
            }
        }
    }
    if (req.body.nSource != 0)
    {
        source = `AND src='${req.body.nSource}'`
    }
    if (req.body.dSource != 0)
    {
        destination = `AND dst='${req.body.dSource}'`
    }
    var page = 1
    if (req.body.page)
    {
        page = parseInt(req.body.page)
    }
    
    if (data.dateD && data.dateF)
    {
        console.log(req.body.nSource)
        pgserv.query(`SELECT COUNT(*) FROM cdr WHERE calldate BETWEEN '${data.dateD}' AND '${data.dateF}' ${duration} ${call} ${source} ${destination}`, (error, results) => {
            if (error) {
                throw error
            }
            pgserv.query(`SELECT * FROM cdr WHERE calldate BETWEEN '${data.dateD}' AND '${data.dateF}' ${duration} ${call} ${source} ${destination} ORDER BY calldate DESC OFFSET ${(page - 1) * 10} LIMIT 10`, (error, results2) => {
                if (error) {
                    throw error
                }
                res.status(200).json({
                    count: results.rows[0].count,
                    records: results2.rows
                })
            
            })
        })
    } else {
        pgserv.query(`SELECT COUNT(*) FROM cdr`, (error, results) => {
            if (error) {
              throw error
            }
            pgserv.query(`SELECT * FROM cdr OFFSET ${(page - 1) * 10} LIMIT 10`, (error, results2) => {
                if (error) {
                  throw error
                }
                res.status(200).json({
                    count: results.rows[0].count,
                    records: results2.rows
                })
            })
        })
    }
})

router.post("/login", (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    pgserv.query(`SELECT id,username,password FROM admin WHERE username='${username}'`, (error, result) => {
        if (error)
        {
            throw error
        } else {
            if (result.rowCount == 1)
            {
                bcrypt.compare(password, result.rows[0].password, (err,result2) => {
                    if (!result2) {
                        res.status(250).json({message: "Auth failed"}) 
                    } else {
                        const token = jwt.sign(
                            {
                                username: username,
                                userId: result.rows[0].id
                            }, 
                            process.env.JWT_KEY,
                            {
                                expiresIn: '5h'
                            }
                        )
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        })
                    }
                })
            } else {
                res.status(250).json({message: "Auth failed"})
            }
        }
    })
})

router.post("/check", (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded;
        res.status(200).json({message: "Success"})
    } catch (error) {
        return res.status(250).json({
            message: 'Auth failed'
        })
    }
})

module.exports = router