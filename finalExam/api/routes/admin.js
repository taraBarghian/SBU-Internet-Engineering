const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();

const Admin = require('../models/admin');
const super_checkauth = require('../middleware/super_check-auth')
const admin_checkauth = require('../middleware/admin_auth_check')


router.post('/login' , (req, res, next)=>{
    Admin.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: "Email does not exist"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            console.log(result)
            console.log(err)
            console.log(req.body.password == user[0].password)

            if(!result){
                return res.status(401).json({
                message: "Incorrect Password"
            })
        }else{
               const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY, 
                {
                expiresIn: "1h"
                });

                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                })
            }

        })
    })
    .catch(err =>{
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    })
})







module.exports = router;