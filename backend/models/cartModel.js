const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    services: [
        {
            serviceId: {
                type: String,
                required: [true, 'Please enter service details']
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Please enter user details']
    }
})

module.exports = mongoose.model('cart', cartSchema);