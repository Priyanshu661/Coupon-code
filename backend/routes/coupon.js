const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();
const Coupon=mongoose.model("Coupon")


router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new coupon code
router.post('/coupons', async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});


router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(coupon);
  } catch (error) {
    res.status(404).json({ error: 'Coupon not found' });
  }
});


router.delete('/coupons/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Coupon not found' });
  }
});

router.post('/checkout', async (req, res) => {
  const { couponCode, totalPrice } = req.body;

  try {
 
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }

    if (coupon.expirationDate < Date.now()) {
      return res.status(400).json({ error: 'Coupon code has expired' });
    }

    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (coupon.discountAmount / 100) * totalPrice;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountAmount;
    }

    const finalPrice = totalPrice - discountAmount;

    res.json({ discountAmount, finalPrice });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports=router