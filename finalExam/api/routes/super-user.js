const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router();
const User = require('../models/super-user');
const Admin = require('../models/admin');
const super_checkauth = require('../middleware/super_check-auth')


router.post('/login' , (req, res, next)=>{
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: "Email does not exist"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
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
        res.status(500).json({
            message: err.message
        })
    })
})

router.post('/signup' ,super_checkauth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                error: err
            })
        }else{
            const a = new Admin({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash // to be more secure
            })
            a
            .save()
            .then( result => {
                return res.status(201).json({
                    message: 'User created'
                })
            })
            .catch( err => {
                console.log(err)
                return res.status(500).json({
                    message: err.message
                })
                
            })
        }
    })  
})

router.delete("/:uEmail" ,super_checkauth, (req, res, next) => {
    const email = req.params.uEmail
    Admin.remove({email: email})
    .exec() 
    .then( result => {
        const dc = result.deletedCount;
        console.log(result);
        if(dc>0){
            return res.status(200).json("successfully removed")
        }else{
            return res.status(404).json("no valid entry found for provided Name")
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    });
})







module.exports = router;