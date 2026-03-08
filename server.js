const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// تشغيل الملفات الثابتة (HTML / CSS / JS)
app.use(express.static(path.join(__dirname)))

const PORT = process.env.PORT || 3000

// الاتصال بقاعدة البيانات
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/koftaStore"

mongoose.connect(MONGO_URL,{
useNewUrlParser:true,
useUnifiedTopology:true
})
.then(()=> console.log("MongoDB connected"))
.catch(()=> console.log("MongoDB not connected"))


// نموذج الطلب
const Order = mongoose.model("Order",{

orderId:String,
game:String,
playerId:String,
amount:String,
wallet:String,
payment:String,
transaction:String,
status:{type:String,default:"pending"}

})


// ارسال طلب شحن
app.post("/api/charge",async(req,res)=>{

try{

const order = new Order({

orderId:req.body.orderId,
game:req.body.game,
playerId:req.body.playerId,
amount:req.body.amount,
wallet:req.body.wallet,
payment:req.body.payment,
transaction:req.body.transaction

})

await order.save()

res.json({message:"order sent"})

}catch(err){

res.json({message:"database error"})

}

})


// جلب الطلبات للادمن
app.get("/api/orders",async(req,res)=>{

try{

const orders = await Order.find().sort({_id:-1})
res.json(orders)

}catch{

res.json([])

}

})


// قبول الطلب
app.post("/api/orders/accept/:id",async(req,res)=>{

try{

await Order.findByIdAndUpdate(req.params.id,{status:"accepted"})
res.json({message:"accepted"})

}catch{

res.json({message:"error"})

}

})


// رفض الطلب
app.post("/api/orders/reject/:id",async(req,res)=>{

try{

await Order.findByIdAndUpdate(req.params.id,{status:"rejected"})
res.json({message:"rejected"})

}catch{

res.json({message:"error"})

}

})


// حذف الطلب
app.post("/api/orders/delete/:id",async(req,res)=>{

try{

await Order.findByIdAndDelete(req.params.id)
res.json({message:"deleted"})

}catch{

res.json({message:"error"})

}

})


// تشغيل السيرفر
app.listen(PORT,()=>{

console.log("Server running on port " + PORT)

})