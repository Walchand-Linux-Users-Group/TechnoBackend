const mongoose = require('mongoose');
const monngodb_url = "mongodb+srv://wlugtechnotweet:technotweet123@cluster0.8uhbeb2.mongodb.net/?retryWrites=true&w=majority";
const connectMongoDB = async ()=>{
    await mongoose.connect(monngodb_url).then(()=>{
        console.log("mongodb is connected");
    }).catch((error)=>{
        console.log("mongodb not connected");
        console.log(error);
    });     
}
  
module.exports = connectMongoDB    

