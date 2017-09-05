var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/', function(req, res, next){
    var user = new User({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email:req.body.email
    });
    user.save(function(error, result){
        if(error){
            return res.status(500).json({
                title: 'An error occured',
                error: error
            })
        }
        res.status(201).json({
            message:'User created',
            obj: result
        })
    })
})

router.post("/signin", function(req, res, next){
    User.findOne({email:req.body.email}, function(error, user){
        if(error){
            return res.status(500).json({
                title: 'An error occured',
                error: error
            });
        }
        if(!user){
            return res.status(500).json({
                title: 'Login Failed',
                error: {
                    message: 'Invalid Login credentials'
                }
            });
        }
        if(!bcrypt.compareSync(req.body.password,user.password)){
            return res.status(401).json({
                title: 'Login Failed',
                error: {
                    message: 'Invalid Login credentials'
                }
            });
        }
        var token = jwt.sign(
            {user:user},
            'secret',
            {expiresIn:72000}
        )
        res.status(200).json({
            message:'Successfully Logged in',
            token:token,
            userId:user._id
        })

    })
})

module.exports = router;