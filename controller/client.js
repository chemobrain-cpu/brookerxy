const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const { } = require("../database/databaseConfig")




// group_5 controllers
module.exports.gethome = async (req, res,next) => {
   res.status(200).render('home')
}

module.exports.getabout = async (req, res,next) => {
   res.status(200).render('about')
}

module.exports.getlogin = async (req, res,next) => {
   res.status(200).render('login')
}

module.exports.getregister = async (req, res,next) => {
   res.status(200).render('register')
}

module.exports.getterms = async (req, res,next) => {
   res.status(200).render('terms')
}













































































