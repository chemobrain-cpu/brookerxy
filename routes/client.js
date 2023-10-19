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
let getregister = require("../controller/client").getregister
let getterms = require("../controller/client").getterms

router.get('/', gethome)
router.get('/about', getabout)
router.get('/login', getlogin)
router.get('/egister', getregister)
router.get('/terms', getterms)

exports.router = router