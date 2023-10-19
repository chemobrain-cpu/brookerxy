const mongoose = require("mongoose")
mongoose.connect(process.env.DB_LOCAL).then(() => {
    //console.log("connected to database")
})

const caseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    caseOwner: {
        type: String,
    },

    subject: {
        type: String,
    },
    clientEmail: {
        type: String,
    },
    clientPhoneNumber: {
        type: String,

    },
    clientAddress: {
        type: String,
    },
    
    caseNumber:{
        type:String
    },
    caseSubject:{
        type:String
    },
    caseCategory:{
        type:String
    },
    caseMatter:{
        type:String
    },
    status:{
        type:String
    },
    attorney:{
        type:String
    },
    courtCaseNumber:{
        type:String
    },
    stage1:{
        type:String
    },
    stage2:{
        type:String
    },
    stage3:{
        type:String
    },
    progress:{
        type:String
    },
    chargingCourt:{
        type:String
    },
    nextCaseDate:{
        type:String
    },

    dateAdded:{
        type:String
    }
})


const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
    },
    password: {
        type: String
    }
})

const attorneySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameOfAttorney: {
        type: String,
    },
    about: {
        type: String,
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    photo: {
        type: String
    }
})


const blogSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    blog_photo_url:{
        type:String
    },
    blog_topic:{
        type:String,
        required:true

    },
    date:{
        type:Date,
    },
    numOfView:{
        type:Number,
        default:0
    },
    blog_text:{
        type:String,
        required:true
    },
    blog_qoute:{
        type:String
    },
    blog_topic2:{
        type:String
    },
    blog_photo_url2:{
        type:String
    },
    blog_text2:{
        type:String
    },
})

const blogCaseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    case_photo_url: {
        type: String
    },
    case_type: {
        type: String
    },
    case_topic: {
        type: String
    },
    case_text: {
        type: String
    },
    case_attorney: {
        type: String,
    },
    case_duration: {
        type: String
    },
    result_price: {
        type: String
    },
    case_category: {
        type: String
    },
    case_challenge: {
        type: String
    },
    case_legal_strategy: {
        type: String
    },
    result_text: {
        type: String
    }


})



let Attorney = new mongoose.model("attorney", attorneySchema)
let Case = new mongoose.model("case", caseSchema)
let Admin = new mongoose.model("admin", adminSchema)
let Blog = new mongoose.model("blog", blogSchema)
let BlogCase = new mongoose.model("blogCase", blogCaseSchema)

module.exports.Case = Case
module.exports.Admin = Admin
module.exports.Attorney = Attorney

module.exports.Blog = Blog
module.exports.BlogCase = BlogCase