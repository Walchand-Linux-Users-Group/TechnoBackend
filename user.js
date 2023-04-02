const mongoose = require('mongoose')


const empschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone:{
        type: Number,
        required: true,
    },
    transactionId:{
        type: String,
        required: true
    },
    isDualBooted:{
        type: String,
        required: true,
    },
    collegeName:{
        type: String,
        required: true,
    },
    yearOfStudy:{
        type: String,
        required: true,
    },
    course:{
        type: String,
        required: true,
    }
});
module.exports =  mongoose.model('user',empschema);