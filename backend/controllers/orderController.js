const Order = require('../models/orderModel');
const Service = require('../models/service/serviceModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const AsyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// placing a new order
const placeNewOrder = AsyncErrorHandler(async (req, res, next) => {
    const { professional, service, paymentMode } = req.body;
    if (req.user.id == professional) {
        return next(new ErrorHandler('You can\'t place an order to yourself.'));
    }
    const serviceInfo = await Service.findById(service);
    const order = await Order.create({
        user: req.user.id,
        professional,
        service,
        paymentMode,
        totalCost: serviceInfo.price
    });

    const profUser = await User.findById(professional);
    profUser.professional.orders.push({order: order._id.toString()});
    await profUser.save({ validateBeforeSave: false });
    
    // `Hello ${profUser.name}👋,\nA new service has been requested for you. Please check your orders!\n@servicefair.official`,

    res.status(201).json({
        success: true,
        order,
        profUser
    });
});

// update order status
const updateOrderStatus = AsyncErrorHandler(async (req, res, next) => {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler('Error: Order doesn\'t exist', 404));
    }
    const { status, description, value } = req.body;
    order.status = status;
    if (status.toLowerCase() === "completed") {
        const service = await Service.findById(order.service);
        const profUser = await User.findById(order.professional);
        const prof = profUser.professional;
        prof.totalEarnings = Number(prof.totalEarnings) + Number(service.price) * 0.80;
        prof.ordersCompleted = Number(prof.ordersCompleted) + 1;
        await profUser.save({ validateBeforeSave: false });
    }
    if (description.length > 0) {
        order.addCost = {
            description,
            value
        };
    }
    order.totalCost = Number(order.totalCost) + Number(value);
    await order.save({ new: true, validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    });
})

// accept order
const acceptOrder = AsyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { accept } = req.body;
    const order = await Order.findById(id);
    if (accept) {
        order.isAccepted = true;
        order.status = "Order Placed"
    }
    await order.save({ new: true, validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    });
})

// get user orders
const getMyOrders = AsyncErrorHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).populate({ path: 'service' }).populate({ path: 'professional' });
    res.status(200).json({
        success: true,
        orders
    });
})

// get user orders
const getOrderDetails = AsyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const orders = await Order.findById(id).populate({ path: 'service' });

    res.status(200).json({
        success: true,
        orders
    });
})

// delete an order
const deleteOrder = AsyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    await Order.findByIdAndDelete(id);
    
    const profUser = await User.findById(order.professional);

    let profOrders = profUser.professional.orders;
    profOrders = profOrders.filter(item => {
        return item.order.toString() !== id
    });

    profUser.professional.orders = profOrders;
    await profUser.save({ validateBeforeSave: false });

    // const cartInfo = await Cart.findOne({ user: order.user });

    // let services = cartInfo.services;
    // services = services.filter(service => {
    //     return service.serviceId.toString() !== order.service.toString();
    // });

    // cartInfo.services = services;
    // await cartInfo.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

module.exports = {
    placeNewOrder,
    updateOrderStatus,
    getMyOrders,
    getOrderDetails,
    acceptOrder,
    deleteOrder
}