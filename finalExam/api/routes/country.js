const express = require('express');
const mongoose = require('mongoose');
const { route } = require('../../app');
const router = express.Router();

const Country = require('../models/country');
const super_checkauth = require('../middleware/super_check-auth')
const admin_checkauth = require('../middleware/admin_auth_check')


router.get( "/:sort?" ,  (req, res, next) => {
    console.log("+++++++++++++++++++++++++++++++++++++++")
    const sort_key = req.params.sort
    console.log(sort_key)
    Country.find().sort(sort_key)
    .exec() 
    .then( docs => {
        //console.log(docs);
        if(docs.length>0){
            return res.status(200).json(docs)
        }else{
            return res.status(404).json("no entries found")
        }
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            error: err
        });
    });
})

router.post('/:cName' ,super_checkauth, (req, res, next) => {
    const name = req.params.cName
    const c = Country.findOne({name: name})
    // console.log("+++++++++++++++++++++++++++++++++++++++")
    // console.log(c)
    if(c.length>0){
       return res.status(409).json({
            messege: 'This country exists.'
    })
    }

    const country = new Country({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        todayCases:0, 
        todayDeaths: 0,
        todayRecovered: 0,
        critical: 0,
    })
    country
    .save()
    .then(result => {
        console.log(result)
        return res.status(201).json({
            messege: 'Handle POST req to /countries',
            name: name,
            todayCases:0, 
            todayDeaths: 0,
            todayRecovered: 0,
            critical: 0,
        })
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({
            message: err.message,
            error: err
        });
    });

    
});


router.get("/:cName", (req, res, next) => {
    const name = req.params.cName
    Country.findOne({name: name})
    .exec() 
    .then( doc => {
        console.log(doc);
        if(doc){
            return res.status(200).json({doc})
        }else{
            return res.status(404).json("no valid entry found for provided Name")
        }
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            message: "an error occurred",
            error: err
        });
    });
})


router.delete("/:cName", super_checkauth,(req, res, next) => {
    const name = req.params.cName
    Country.remove({name: name})
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
        return res.status(500).json({
            message: "an error occurred",
            error: err
        });
    });
})
    

router.put("/:cName", admin_checkauth,(req, res, next) => {

    const name = req.params.cName
    Country.updateOne({name: name}, {
        todayCases: req.body.todayCases, 
        todayDeaths:  req.body.todayDeaths,
        todayRecovered: req.body.todayRecovered,
        critical:  req.body.critical
    })
    .exec() 
    .then( result => {
        mc = result.matchedCount;
        console.log(result);
        if(mc>0){
          return  res.status(200).json({
                message:"successfully changed"
            })
       }else{
         return res.status(404).json({
            message:"no valid entry found for provided Name"
        })
       }
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            message: "an error occurred",
            error: err
        });
    });
})



module.exports = router;