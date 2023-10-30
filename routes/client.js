const express = require("express")
const router = express.Router()

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

let gettradecenter  = require("../controller/client").gettradecenter
let getdeposit =  require("../controller/client").getdeposit
let postdeposit =  require("../controller/client").postdeposit
let getwithdraw =  require("../controller/client").getwithdraw
let postwithdraw =  require("../controller/client").postwithdraw

let postconfirmwithdraw =  require("../controller/client").postconfirmwithdraw
let getrecentwithdraw =  require("../controller/client").getrecentwithdraw
let getupgrade =  require("../controller/client").getupgrade

let getsupport =  require("../controller/client").getsupport

let  getchangepassword=  require("../controller/client").getchangepassword
let  postchangepassword=  require("../controller/client").postchangepassword

let  getpayment =  require("../controller/client").getpayment

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



//dashboard route
router.get('/index',getdashboardhome)
router.get('/deposit',getdeposit)
router.post('/deposit',postdeposit)
router.get('/withdraw',getwithdraw)
router.post('/withdraw',postwithdraw)
router.post('/confirmwithdraw/:amount',postconfirmwithdraw)

router.get('/recent_withdraw',getrecentwithdraw)
router.get('/trade_center',gettradecenter)
router.get('/upgrade',getupgrade)
router.get('/chat',getsupport)
router.get('/support',getsupport)
router.get('/password',getchangepassword)
router.post('/password',postchangepassword)
router.get('/payment/:id',getpayment)
router.get('/logout',getlogout)





exports.router = router