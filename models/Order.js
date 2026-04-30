import mongoose from 'mongoose';

const garmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    garments: { type: [garmentSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
      default: 'RECEIVED',
      index: true,
    },
    estimatedDelivery: { type: Date },
  },
  {
    timestamps: true,
    // Converts _id (ObjectId) to string automatically when sending JSON
    // Prevents "cannot serialize object with non-string keys" errors on Vercel
    toJSON: {
      transform(doc, ret) {
        ret._id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Guard against Mongoose model re-registration (Next.js hot reload)
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
