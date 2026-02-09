import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },       // snapshot at time of order
  price: { type: Number, required: true },      // snapshot (important!)
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },

  paymentMethod: {
    type: String,
    default: "transfer",
  },

  bankReference: {
    type: String,
  },

  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);