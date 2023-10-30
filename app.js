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


app.use((req, res, next) => {
    if (req.path.slice(-1) === '/' && req.path.length > 1) {
      const query = req.url.slice(req.path.length)
      const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
      res.redirect(301, safepath + query)
    } else {
      next()
    }
  })


app.use("/",express.static("public"));
app.use("/payment/",express.static("public"));
app.use("/confirmwithdraw/",express.static("public"));
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


//confirm withdraw btc

//confirm withdraw bank




//using the routes
app.use(clientRoutes.router)


app.get('/admin',(req,res)=>{
    res.send(`you're about logging in to stockexchangemanagement admin panel. click<br>  <a href='https://brooker-admin.onrender.com'>here</a>`)
})


//error handler //express error middleware
app.use((err,req,res,next)=>{
     console.log(err)
    err.statusCode = err.statusCode || 300
    err.message = err.message 
    res.status(err.statusCode).render("home",)
})



app.listen(process.env.PORT||8080,(err)=>{
   console.log(err)
    console.log("sucessfully")
})