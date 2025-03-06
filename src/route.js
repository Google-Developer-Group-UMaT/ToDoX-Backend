const express = require('express');
const router = express.Router();
const runDOT = require('./dot');




router.post("/dot" , async function(req , res){



    try{


        const {query , history} = req.body;
            
        const response = await runDOT(history ? history : [] , query)


        return res.status(200).json({
            status : "success" , 
            message : response
        })
            



    }

    catch(e){

        res.status(500).json({
            message : "An internal server error occured"
        })
    }





})


module.exports = router;