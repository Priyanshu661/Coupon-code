const mongoose=require("mongoose")

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
});








mongoose.model("Coupon",couponSchema)