import mongoose from "mongoose";

const garmentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerItem: { type: Number, required: true },
    subtotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    garments: [garmentSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
        default: 'RECEIVED'
    },
    estimatedDelivery: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;