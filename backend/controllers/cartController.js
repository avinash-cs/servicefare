const Cart = require('../models/cartModel');
const Service = require('../models/service/serviceModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Archive = require('../models/archivedModel');
const AsyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// adding a service to cart
const addServiceToCart = AsyncErrorHandler(async (req, res, next) => {
    const { id: serviceId } = req.params;
    let cartInfo = await Cart.findOne({ user: req.user.id });

    if (!cartInfo) {
        cartInfo = await Cart.create({
            user: req.user.id,
            services: [{serviceId}]
        });
    } else {
        let flag = false;
        for (const service of cartInfo.services) {
            if (service.serviceId.toString() === serviceId) {
                flag = true;
                break;
            }
        }
        if (!flag)
        cartInfo = await Cart.findOneAndUpdate({ user: req.user.id }, {
            $push: {
                services: {serviceId}
            }
        });
    }
    res.status(200).json({
        success: true,
        cartInfo
    });
});

// get all the services in the cart of a user
const getServices = AsyncErrorHandler(async (req, res, next) => {
    const cartInfo = await Cart.findOne({ user: req.user.id });
    if (!cartInfo) {
        return res.status(200).json({success: true, result: []});
    }
    const result = [];
    for (const item of cartInfo.services) {
        const service = await Service.findById(item.serviceId);
        const order = await Order.findOne({user: req.user.id, service : item.serviceId});
        result.push({
            id: service.id,
            name: service.name,
            image: service.serviceImage,
            price: service.price,
            category: service.category,
            isOrderAccepted: order ? order.isAccepted : undefined,
            isCompleted: order && order.status === "Completed" ? true : false,
            professional: order ? order.professional : null 
        });
    }

    res.status(200).json({
        success: true,
        result
    });
})

// delete a service from cart 
const deleteServiceFromCart = AsyncErrorHandler(async (req, res, next) => {
    const { id: serviceId } = req.params;
    await Cart.findOneAndUpdate({ user: req.user.id }, {
        $pull: {
            services: {serviceId}
        }
    });

    const order = await Order.findOne({ user: req.user.id, service: serviceId });

    const details = {
        service: order.service,
        status: order.status,
        paymentMode: order.paymentMode,
        addCost: {
            description: order.addCost.description,
            value: order.addCost.value
        },
        totalCost: order.totalCost,
        isAccepted: order.isAccepted,
        completedAt: order.completedAt
    }

    let archive = await Archive.findOne({ user: req.user.id, professional: order.professional });

    if (!archive) {
        archive = await Archive.create({
            user: req.user.id,
            professional: order.professional,
            orders: [details]
        })
    } else {
        archive.orders.push(details);
        await archive.save({ validateBeforeSave: false });
    }

    await Order.findByIdAndDelete(order._id);
    
    const profUser = await User.findById(order.professional);

    let profOrders = profUser.professional.orders;
    profOrders = profOrders.filter(item => {
        return item.order.toString() !== order.id.toString()
    });

    profUser.professional.orders = profOrders;
    await profUser.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
})

// cancel a request sent to professional
const cancelRequest = AsyncErrorHandler(async (req, res, next) => {
    const { id: serviceId } = req.params;
    const order = await Order.findOne({ service: serviceId, user: req.user.id });
    if (order.isAccepted) {
        return next(new ErrorHandler('Order has been accepted by the professional', 400));
    }
    await Order.findOneAndDelete({ service: serviceId, user: req.user.id });
    
    const profUser = await User.findById(order.professional);

    let profOrders = profUser.professional.orders;
    profOrders = profOrders.filter(item => {
        return item.order.toString() !== order._id.toString()
    });

    profUser.professional.orders = profOrders;
    await profUser.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

module.exports = {
    addServiceToCart,
    getServices,
    deleteServiceFromCart,
    cancelRequest
}