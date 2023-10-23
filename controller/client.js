const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const { User, Admin, Transaction } = require("../database/databaseConfig")
const Mailjet = require('node-mailjet')
let request = require('request');



const { welcomeTemplate, fundTemplate, withdrawTemplate } = require('../utiils/util')




// group_5 controllers
module.exports.gethome = async (req, res, next) => {
   res.status(200).render('home')
}

module.exports.getabout = async (req, res, next) => {
   res.status(200).render('about')
}

module.exports.getlogin = async (req, res, next) => {
   res.status(200).render('login')
}

module.exports.getregister = async (req, res, next) => {
   res.status(200).render('register')
}

module.exports.postregister = async (req, res, next) => {

   let { fullname,
      email,
      phone,
      gender,
      country,
      kudi,
      password,
      confirm_password, } = req.body


   try {
      let userExist = await User.findOne({ email: email })

      if (userExist) {
         return res.status(200).render('registererror', { msg: 'a user with this email already exist' })
      }

      //check if the confirm password match

      if (password !== confirm_password) {

         return res.status(200).render('registererror', { msg: 'Password and Confirm password field does not match' })

      }

      //send welcome message
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )

      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                     "Email": "support@stockexchangecryptomanagement.com",
                     "Name": "support"
                  },
                  "To": [
                     {
                        "Email": `${email}`,
                        "Name": "fullname"
                     }
                  ],
                  "Subject": "Account Verification",
                  "TextPart": `Dear ${email}, welcome to Stockexchangecryptomanagement`,
                  "HTMLPart": welcomeTemplate(email)
               }
            ]
         })


      if (!request) {
         let error = new Error("please use a valid email")
         return next(error)
      }


      //creating a new user
      let newUser = new User({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         fullName: fullname,
         phoneNumber: phone,
         gender: gender,
         country: country,
         currency: kudi,
         password: password
      })

      let savedUser = await newUser.save()

      if (!savedUser) {
         return res.status(200).render('registererror', { msg: 'An error occured,try later' })
      }

      //get all attorneys
      return res.status(200).render('loginsucess')

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }

}
//say yes
module.exports.getterms = async (req, res, next) => {
   res.status(200).render('terms')
}
module.exports.forgetpassword = async (req, res, next) => {
   res.status(200).render('forget-password')
}
module.exports.postforgetpassword = async (req, res, next) => {

   let { email } = req.body
   try {
      //get all attorneys
      return res.status(200).render('forget-password-error')

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }




}


module.exports.postlogin = async (req, res, next) => {
   let { email, password } = req.body

   try {
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         //get all attorneys
         return res.status(200).render('loginerror', { msg: 'Login Failed. Email/password combination not found' })
      }

      //if password is incorrect
      if (userExist.password !== password) {
         //get all attorneys
         return res.status(200).render('loginerror', { msg: 'Password incorrect' })
      }

      req.session.user = userExist

      //get all attorneys
      return res.status(200).render('dashboardHome', { user: req.session.user })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

//protected route
module.exports.getdashboardHome = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')

   } else {
      return res.status(200).render('dashboardHome', { user: req.session.user })

   }
}

module.exports.getdashboardhome = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')

   } else {

      return res.status(200).render('dashboardHome', { user: req.session.user })
   }
}


module.exports.getdeposit = async (req, res, next) => {
   if (!req.session.user) {

      return res.status(200).render('login')
   } else {
      let admin = await Admin.find()
      res.status(200).render('deposit', { user: req.session.user, admin: admin[0] })
   }
}


module.exports.getwithdraw = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')
   } else {
      return res.status(200).render('withdraw', { user: req.session.user })
   }
}


module.exports.gettransaction = async (req, res, next) => {
   try {
      if (!req.session.user) {

         return res.status(200).render('login')
      } else {
         let transactions = await Transaction.find({ user: req.session.user })
         if (!transactions) {
            throw new Error('an error occured')
         }
         return res.status(200).render('transaction', { user: req.session.user, transactions: transactions })
      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.postwithdraw = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         //posting 
         let {
            amount,
            withdrawal_method,
         } = req.body

         let newUser = await User.findOne({ email: req.session.user.email })
         if (!newUser) {
            throw new Error('an error occured')

         }



         //check if account is activated
         if (newUser.accountStatus === 'inactive') {
            return res.status(200).render('withdrawinactive', { user: newUser })
         }
         //check if user has the amount
         if (Number(newUser.availableBalance) < Number(amount)) {
            return res.status(200).render('withdrawalinsufficient', { user: newUser })
         }

         newAvailableBalance = Number(newUser.availableBalance) - Number(amount)
         newUser.availableBalance = newAvailableBalance

         let savedUser = await newUser.save()




         // Create mailjet send email
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )

         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@stockexchangecryptomanagement.com",
                        "Name": "support"
                     },
                     "To": [
                        {
                           "Email": `${req.session.user.email}`,
                           "Name": `${req.session.user.fullName}`
                        }
                     ],
                     "Subject": "DEBIT",
                     "TextPart": `Your Coincap account has  been debited  $ ${amount}  `,

                     "HTMLPart": withdrawTemplate(req.session.user.email, req.session.currency, amount)
                  }
               ]
            })

         if (!request) {
            let error = new Error("an error occured on the server")
            return next(error)
         }


         if (!newUser) {
            throw new Error('an error occured')
         }



         //transaction history


         let newTransaction = new Transaction({
            _id: new mongoose.Types.ObjectId(),
            medium: withdrawal_method,
            amount: amount,
            from: 'Stock exchange crypto management',
            to: withdrawal_method,
            user: savedUser
         })


         let saveTransaction = await newTransaction.save()

         if (!saveTransaction) {
            throw new Error('an error occured')
         }

         res.status(200).render('withdrawalsucessful', { user: req.session.user })
      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}




module.exports.getkyc = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')
   } else {
      if (req.session.user.passportUrl && !req.session.user.kycVerified) {
         //return waiting dashboard
         return res.status(200).render('waitingkyc', { user: req.session.user })

      } else if (req.session.user.passportUrl && req.session.user.kycVerified) {
         //return successfully dashboard kyc registered start trading
         return res.status(200).render('waitingkyc', { user: req.session.user })

      } else {
         return res.status(200).render('kyc', { user: req.session.user })
      }


   }
}
module.exports.postkyc = async (req, res, next) => {
   if (!req.session.user) {
      console.log(req.body)
   } else {
      console.log(req.file)
      res.status(200).render('kyc', { user: req.session.user })
   }
}

module.exports.getinvestmentplans = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')
   } else {
      res.status(200).render('investment-plan', { user: req.session.user })
   }

}


module.exports.getprofile = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')
   } else {
      res.status(200).render('profile', { user: req.session.user })
   }

}

module.exports.getlogout = async (req, res, next) => {
   return res.status(200).render('home')

}




User.find().then(data => {
   console.log(data)
})

















































































