const express=require("express");
const mongoose=require("mongoose")
const bodyParser = require('body-parser');
const app=express()
const PORT=5000 || process.env.PORT
const {MONGOURI}=require("./config/keys")
const cors=require("cors")

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})

mongoose.connection.on("error",(err)=>{
    console.log("error connecting to mongodb",err)
})


require("./models/coupon")

app.use(cors())

app.use(bodyParser.json());

app.use(require("./routes/coupon"))







app.listen(PORT,function(){
    console.log("Server is running on",PORT)
})