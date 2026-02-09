import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:        { type: String,  required: true, trim: true },
  description: { type: String,  required: true },
  price:       { type: Number,  required: true },
  stock:       { type: Number,  required: true, default: 0 },
  image:       { type: String }, // URL
}, { timestamps: true });

export default mongoose.model('Product', productSchema);