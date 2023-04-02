const mongoose = require('mongoose');
const monngodb_url = "mongodb+srv://harsh_1503:Harsh%401345@cluster0.cyke1hx.mongodb.net/?retryWrites=true&w=majority";
const connectMongoDB = async ()=>{
    await mongoose.connect(monngodb_url).then(()=>{
        console.log("mongodb is connected");
    }).catch((error)=>{
        console.log("mondb not connected");
        console.log(error);
    }); 
}

module.exports = connectMongoDB