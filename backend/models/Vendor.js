const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  suppliedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }],
  paymentStatus: { type: String, enum: ['Paid', 'Due', 'Partial'], default: 'Paid' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
