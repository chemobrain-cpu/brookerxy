const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")



//importing from group1
let gethome = require("../controller/client").gethome
let getabout = require("../controller/client").getabout
let getlogin = require("../controller/client").getlogin


let postlogin = require("../controller/client").postlogin

let getregister = require("../controller/client").getregister

let postregister = require("../controller/client").postregister


let getterms = require("../controller/client").getterms
let forgetpassword = require("../controller/client").forgetpassword 

let postforgetpassword = require("../controller/client").postforgetpassword 
let getdashboardhome =  require("../controller/client").getdashboardhome 

let getkyc =  require("../controller/client").getkyc
let getdeposit =  require("../controller/client").getdeposit
let getwithdraw =  require("../controller/client").getwithdraw
let getprofile = require("../controller/client").getprofile
let getinvestmentplans = require("../controller/client").getinvestmentplans
let getlogout = require("../controller/client").getlogout

router.get('/', gethome)
router.get('/about', getabout)
router.get('/login', getlogin)

router.post('/login', postlogin)

router.get('/register', getregister)
router.post('/register', postregister)
router.get('/terms', getterms)
router.get('/forgot-password',forgetpassword)
router.post('/forgot-password',postforgetpassword)
router.post('/kyc',getkyc)

//dashboard route
router.get('/dashboard',getdashboardhome)
router.get('/kyc',getkyc)
router.get('/deposit',getdeposit)
router.get('/withdraw',getwithdraw)
router.get('/kyc',getkyc)

router.get('/profile',getprofile)
router.get('/investment-plans',getinvestmentplans)
router.get('/logout',getlogout)




exports.router = router