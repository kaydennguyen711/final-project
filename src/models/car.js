import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  year: Number,
  make: String,
  model: String,
  imageUrl: { type: String, required: true },
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);

