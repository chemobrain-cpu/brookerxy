const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const { User, Admin, Deposit, Withdraw, Trade } = require("../database/databaseConfig")
const Mailjet = require('node-mailjet')
let request = require('request');
const random_number = require("random-number")

User.find().then(data=>{
   console.log(data)
})


const { welcomeTemplate, fundTemplate, withdrawTemplate,DepositAlert } = require('../utiils/util')

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

   let {
      fullname,
      email,
      phone,
      gender,
      country,
      kudi,
      password,
      confirm_password
   } = req.body


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
                     "Name": "stockexchangecryptomanagement"

                  },
                  "To": [
                     {
                        "Email": `${email}`,
                        "Name": `${fullname}`
                     }
                  ],

                  "Subject": "Welcome Message",
                  "TextPart": `Dear ${email}, welcome to Stockexchangecryptomanagement`,
                  "HTMLPart": welcomeTemplate(fullname)
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
   console.log(req.body)
   try {
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         //get all attorneys
         return res.status(200).render('loginerror', { msg: 'Login Failed. Email/password combination not found' })
      }

      //if password is incorrect
      if (userExist.password != password) {
         //get all attorneys
         return res.status(200).render('loginerror', { msg: 'Password incorrect' })
      }

      req.session.user = userExist

      //get all attorneys
      return res.status(200).render('dashboard', { user: req.session.user })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

//protected route and dashboard
module.exports.getdashboardhome = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(200).render('login')

   } else {
      return res.status(200).render('dashboard', { user: req.session.user })

   }
}

module.exports.getdeposit = async (req, res, next) => {
   try {
      if (!req.session.user) {

         return res.status(200).render('login')
      } else {
         let admin = await Admin.find()
         if (!admin) {
            console.log('no admin')
            let error = new Error("no admin")
            return next(error)
         }
         let user = await User.findOne({ email: req.session.user.email })
         if (!user) {
            console.log('no user')
            let error = new Error("no user")
            return next(error)
         }
         let deposits = await Deposit.find({ user: user })

         

         if (!deposits) {
            console.log('no deposit')
            let error = new Error("no user")
            return next(error)
         }

         let filteredDeposit = deposits.filter(data=>data.status === 'active')

         return res.status(200).render('deposit', { user: req.session.user, admin: admin[0], deposits:filteredDeposit })

      }

   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }

}

/*
Your request to make a deposit of ${currency}${amount} has been recieved. Make a payment to your preferred investment method now for your live trading account to be funded. Contact us via our livechat if you need a step guide to go about this


*/

module.exports.postdeposit = async (req, res, next) => {
   try {
      if (!req.session.user) {

         return res.status(200).render('login')
      } else {
         let { amount, method } = req.body

         let admin = await Admin.find()
         if (!admin) {

            let error = new Error("no admin")
            return next(error)
         }
         let user = await User.findOne({ email: req.session.user.email })
         if (!user) {
            let error = new Error("no user")
            return next(error)
         }

         let accessToken = random_number({
            max: 5000000,
            min: 4000000,
            integer: true
         })

         let currentdate = new Date()

         var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1)
            + "/" + currentdate.getFullYear() + ","
            + currentdate.getHours() + ":"
            + currentdate.getMinutes()





         const newDeposit = new Deposit({
            _id: new mongoose.Types.ObjectId(),
            status: 'Pending',
            depositId: accessToken,
            type: method,
            date: datetime,
            user: user,
            amount: amount
         })

         let savedDeposit = await newDeposit.save()

         if (!savedDeposit) {
            let error = new Error("could not save deposit")
            return next(error)
         }





         //send deposit message to client
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@stockexchangecryptomanagement.com",
                        "Name": "stockexchangecryptomanagement"

                     },
                     "To": [
                        {
                           "Email": `${user.email}`,
                           "Name": `${user.fullname}`
                        }
                     ],

                     "Subject": "Deposit",
                     "TextPart": `Your request to make a deposit of ${user.currency}${user.amount} has been recieved. Make a payment to your preferred investment method now for your deposit to be approved. contact support@stockexchangecryptomanagement.com`,
                     "HTMLPart": fundTemplate(user.currency, amount)
                  }
               ]
            })

         if (!request) {
            let error = new Error("please use a valid email")
            return next(error)
         }


        /*
         //sending message to admin
         const request_2 = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@stockexchangecryptomanagement.com",
                        "Name": "stockexchangecryptomanagement"

                     },
                     "To": [
                        {
                           "Email": `${user.email}`,
                           "Name": `${admin.email}`
                        }
                     ],
                     "Subject": "Deposit",
                     "TextPart": `A user with the email ${user.email} has attempted to make a deposit. Please ensure your payment information on your admin dashboard are in place!!!!`,

                     "HTMLPart": DepositAlert(user.email)
                  }
               ]
            })

         if (!request_2) {
            let error = new Error("please use a valid email")
            return next(error)
         }
         */





         let modifyUser = await User.findOne({ email: req.session.user.email })
         modifyUser.deposit.push(savedDeposit)
         let savedUser = await modifyUser.save()

         if (!savedUser) {
            let error = new Error("could not modify user")
            return next(error)
         }

         let deposits = await Deposit.find({ user: user })

         let filteredDeposit = deposits.filter(data=>data.status === 'active')
         return res.status(200).render('depositsuccess', { user: req.session.user, admin: admin[0], deposits: filteredDeposit })
      }

   } catch (error) {
      console.log(error)
      error.message = error.message
      return next(error)
   }
}

module.exports.getwithdraw = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         let admin = await Admin.find()
         if (!admin) {
            let error = new Error("an error on the server")
            return next(error)
         }
         let user = await User.findOne({ email: req.session.user.email })
         if (!user) {
            let error = new Error("an error on the server")
            return next(error)
         }
         let withdraws = await Withdraw.find({ user: user })

         return res.status(200).render('withdraw', { user: req.session.user, withdraws: withdraws })
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
            method,
         } = req.body

         if (method === 'Bitcoin') {
            return res.status(200).render('confirmwithdrawbtc', { user: req.session.user, amount: amount, walletname: 'bitcoin' })

         } else if (method === 'zelle') {
            return res.status(200).render('confirmwithdrawbtc', { user: req.session.user, amount: amount, walletname: 'zelle' })

         } else if (method === 'Cashapp') {
            return res.status(200).render('confirmwithdrawbtc', { user: req.session.user, amount: amount, walletname: 'cashapp' })

         } else if (method === 'Etherium') {
            return res.status(200).render('confirmwithdrawbtc', { user: req.session.user, amount: amount, walletname: 'etherium' })

         } else if (method === 'Gcash') {
            return res.status(200).render('confirmwithdrawgcash', { user: req.session.user, amount: amount, walletname: 'gcash' })
         } else if (method === 'Bank') {
            return res.status(200).render('confirmwithdrawbank', { user: req.session.user, amount: amount })
         }
         else if (method === 'Binance') {
            return res.status(200).render('confirmwithdrawbtc', { user: req.session.user, amount: amount, walletname: 'binance' })
         }

      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.postconfirmwithdraw = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         //posting 
         let {
            bank_name,
            account_name,
            account_number,
            iban,
            amount,
            method,
            etherium_address,
            bitcoin_address,
            zelle_address,
            cashapp_address,
            binance_address,
            phone,
            name

         } = req.body

         let user = await User.findOne({ email: req.session.user.email })

         if (!user) {
            let error = new Error("an error occured on the server")
            return next(error)

         }

         let accessToken = random_number({
            max: 5000000,
            min: 4000000,
            integer: true
         })

         let currentdate = new Date()


         var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1)
            + "/" + currentdate.getFullYear() + ","
            + currentdate.getHours() + ":"
            + currentdate.getMinutes()

         let withdrawObj = {
            status: 'pending',
            bitcoin_address: bitcoin_address || '',
            zelle_address: zelle_address || '',
            etherium_address: etherium_address || ' ',
            cashapp_address: cashapp_address || ' ',
            binance_address: cashapp_address || ' ',
            withdrawId: accessToken,
            amount: amount || '',
            method: method || '',
            date: datetime,
            swift: iban || ' ',
            bank_name: bank_name || '',
            account_number: account_number || ' ',
            account_name: account_name || ' ',
            phone: phone || ' ',
            name: name || ' ',
         }

         const newwithdraw = new Withdraw({
            _id: new mongoose.Types.ObjectId(),
            status: withdrawObj.status,
            bitcoin_address: withdrawObj.bitcoin_address,
            zelle_address: withdrawObj.zelle_address,
            etherium_address: withdrawObj.etherium_address,
            cashapp_address: withdrawObj.cashapp_address,
            binance_address: withdrawObj.binance_address,
            withdrawId: withdrawObj.withdrawId,
            amount: withdrawObj.amount,
            method: withdrawObj.method,
            date: withdrawObj.date,
            swift: withdrawObj.swift,
            bank_name: withdrawObj.bank_name,
            account_number: withdrawObj.account_number,
            account_name: withdrawObj.account_name,
            phone: withdrawObj.phone,
            name: withdrawObj.name,
            user: user,

         })

         let savedWithdraw = await newwithdraw.save()
         if (!savedWithdraw) {
            throw new Error('an error occured')
         }



         //send deposit message
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )

         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@stockexchangecryptomanagement.com",
                        "Name": "stockexchangecryptomanagement"

                     },
                     "To": [
                        {
                           "Email": `${user.email}`,
                           "Name": `${user.fullname}`
                        }
                     ],

                     "Subject": "Deposit",
                     "TextPart": `Your request to make a withdrawal of ${user.currency}${user.amount} has been recieved. We will get back to you shortly`,
                     "HTMLPart": withdrawTemplate(user.currency, amount)
                  }
               ]
            })


         if (!request) {
            let error = new Error("please use a valid email")
            return next(error)
         }



         let modifyUser = await User.findOne({ email: req.session.user.email })

         modifyUser.withdraw.push(savedWithdraw)

         let newUser = await modifyUser.save()

         if (!newUser) {
            let error = new Error("an error occured on the server")
            return next(error)
         }

         let withdraws = await Withdraw.find({ user: newUser })

         res.status(200).render('withdraw', { user: newUser, withdraws: withdraws })
      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.getrecentwithdraw = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         return res.status(200).render('recentwithdrawal', { user: req.session.user })

      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.getupgrade = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         return res.status(200).render('upgrade', { user: req.session.user })

      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.gettradecenter = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         let trades = await Trade.find({ user: req.session.user })
         console.log(trades)
         return res.status(200).render('trade-center', { user: req.session.user, trades: trades })
      }

   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getsupport = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         return res.status(200).render('chat', { user: req.session.user })
      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.getchangepassword = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         return res.status(200).render('changepassword', { user: req.session.user })

      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.postchangepassword = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         let { userpassword, newpass, renewpass } = req.body

         if (req.session.user.password !== userpassword) {
            console.log('wrong')
            return res.status(200).render('changepasswordfail', { user: req.session.user })

         } else if (newpass !== renewpass) {
            console.log('mismatch')
            return res.status(200).render('changepasswordfail', { user: req.session.user })

         } else {
            let user = await User.findOne({ email: req.session.user.email })

            if (!user) {
               let error = new Error("no such user found")
               return next(error)
            }

            user.password = newpass
            let savedUser = await user.save()

            return res.status(200).render('changepasswordsuccess', { user: savedUser })
         }

      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getpayment = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.status(200).render('login')
      } else {
         let id = req.params.id

         let admin = await Admin.find()
         if (!admin) {
            let error = new Error("an error on the server")
            return next(error)
         }
         let user = await User.findOne({ email: req.session.user.email })
         if (!user) {
            let error = new Error("an error on the server")
            return next(error)
         }

         let walletaddress

         console.log(admin)

         if (id === 'BITCOIN') {
            walletaddress = admin[0].bitcoinwalletaddress
            return res.status(200).render('payment', { walletaddress: walletaddress, user: user })

         } else if (id === 'ZELLE') {
            walletaddress = admin[0].etheriumwalletaddress
            return res.status(200).render('payment', { walletaddress: walletaddress, user: user })

         } else if (id === 'ETHERIUM') {
            walletaddress = admin[0].gcashwalletaddress
            return res.status(200).render('payment', { walletaddress: walletaddress, user: user })

         } else if (id === 'GCASH') {
            walletaddress = `${admin[0].gcashname} ${admin[0].gcashphonenumber}`
            return res.status(200).render('payment', { walletaddress: walletaddress, user: user })
         }

         else if (id === 'CASHAPP') {
            walletaddress = admin[0].cashappwalletaddress
            return res.status(200).render('payment', { walletaddress: walletaddress, user: user })
         }

         else {
            return res.status(200).redirect('/index', { user: user })
         }



      }

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}




module.exports.getlogout = async (req, res, next) => {
   return res.status(200).render('home')
}





















































































