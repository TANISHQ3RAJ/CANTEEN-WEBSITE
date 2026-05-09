const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  subtotal: { type: Number, required: true },
  gstRate: { type: Number, default: 18 },
  gstAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Online', 'Pending'], default: 'Online' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
