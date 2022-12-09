const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Please provide the user details']
    },
    professional: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Please provide the professional details']
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'service',
        required: [true, 'Please provide the service details']
    },
    status: {
        type: String,
        default: "Processing"
    },
    paymentMode: {
        type: String,
        required: [true, 'Please provide the payment mode']
    },
    addCost: {
        description: {
            type: String
        },
        value: {
            type: Number
        }
    },
    totalCost: {
        type: Number,
        default: 0
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    placedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
})

module.exports = mongoose.model('order', orderSchema);