
require('dotenv').config()
const app = require('express')();
const express = require('express')
const ejs = require("ejs")
const path = require("path")
require('dotenv').config()
const fs = require("fs")
const User = require("./database/databaseConfig").User
const session = require("express-session");
const mongoose = require("mongoose")
app.use(express.static("public"));
app.use("/",express.static("public"));
const cors = require("cors")
const bodyParser = require("body-parser")
const multer = require("multer")
app.use(bodyParser.json())
const { body, validationResult } = require('express-validator')
const compression = require('compression')
const { Server } = require('socket.io')
let server = require('http').createServer(app)
const axios = require('axios')





//setting express to use  the session
app.use(session({
    secret:"mylittlesecret",
    resave:false,
    saveUninitialized:false,
    name:"precious",
    genid:function(){
        return "prechy"
    },
    cookie:{
        maxAge:7800000000000
    }, 
}))



app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))


const clientRoutes = require("./routes/client")

//using the routes
app.use(clientRoutes.router)


//error handler //express error middleware
app.use((err,req,res,next)=>{
     console.log(err.message)
    err.statusCode = err.statusCode || 300
    err.message = err.message 
    res.status(err.statusCode).render("error",{message:err.message})
})



app.listen(process.env.PORT||8080,(err)=>{
   console.log(err)
    console.log("sucessfully")
})