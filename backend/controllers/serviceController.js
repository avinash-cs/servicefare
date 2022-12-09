const Service = require('../models/service/serviceModel');
const { Category }  = require('../models/service/categoryModel');
const AsyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');

// create a new service
const createService = AsyncErrorHandler(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'services',
        width: 150,
        crop: 'scale'
    });

    const { name, categoryName, description, price } = req.body;
    const service = await Service.create({
        name, price, description,
        serviceImage: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        },
        category: categoryName
    });

    res.status(201).json({
        success: true,
        service
    });
})

// create a new service
const createCategory= AsyncErrorHandler(async (req, res, next) => {
    
    const { name,imageUrl } = req.body;
    const category = await Category.create({
        name, imageUrl,
       
    });

    res.status(201).json({
        success: true,
        category
    });
})

// get all categories
const getCategories = AsyncErrorHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        categories
    })
})

// get all services of a particular category
const getAllServices = AsyncErrorHandler(async (req, res, next) => {
    const { name } = req.params;
    const services = await Service.find({ category: name });
    res.status(200).json({
        success: true,
        services
    });
});

// get a service details
const getServiceDetails = AsyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const service = await Service.findById(id);
    res.status(200).json({
        success: true,
        service
    });
})

module.exports = {
    createService,
    createCategory,
    getCategories,
    getAllServices,
    getServiceDetails
}