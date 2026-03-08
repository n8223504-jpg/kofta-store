const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

mongoose.connect("mongodb://127.0.0.1:27017/koftaStore")

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

app.post("/api/charge",async(req,res)=>{

const order=new Order({

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

})

app.get("/api/orders",async(req,res)=>{

const orders=await Order.find().sort({_id:-1})
res.json(orders)

})

app.post("/api/orders/accept/:id",async(req,res)=>{

await Order.findByIdAndUpdate(req.params.id,{status:"accepted"})

res.json({message:"accepted"})

})

app.post("/api/orders/reject/:id",async(req,res)=>{

await Order.findByIdAndUpdate(req.params.id,{status:"rejected"})

res.json({message:"rejected"})

})

app.post("/api/orders/delete/:id",async(req,res)=>{

await Order.findByIdAndDelete(req.params.id)

res.json({message:"deleted"})

})

app.listen(3000,()=>{

console.log("Server running on http://localhost:3000")

})