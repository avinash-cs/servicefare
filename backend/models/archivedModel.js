const mongoose = require('mongoose');

const orderKaSchema = new mongoose.Schema({
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

const archiveSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: [true, 'Please enter user details']
    },
    professional: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: [true, 'Please enter professional details']
    },
    orders: [
        {
            type: orderKaSchema,
            required: [true, 'Please enter order details']
        }
    ],
    archivedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('archive', archiveSchema);