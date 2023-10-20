const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const { User, Admin } = require("../database/databaseConfig")




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
   if (!req.session.user) {
      return res.status(200).render('login')
   } else {
      return res.status(200).render('transaction', { user: req.session.user })
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
            acct_name,
            acct_no,
            receiver_bank,
            paypal_email,
            btc_address,
            withdraw
         } = req.body

         //check if account is activated
         if (req.session.user.accountStatus === 'inactive') {
            return res.status(200).render('withdrawinactive', { user: req.session.user })
         }
         //check if user has the amount
         if (Number(req.session.user.availableBalance) < Number(amount)) {
            return res.status(200).render('withdrawalinsufficient', { user: req.session.user })
         }

         let newUser = req.session.user
         newAvailableBalance = Number(user.availableBalance) - Number(amount)
         newUser.availableBalance = newAvailableBalance

         let savedUser = await newUser.save()
         if (!savedUser) {
            throw new Error('an error occured')
         }

         //transaction history
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

















































































