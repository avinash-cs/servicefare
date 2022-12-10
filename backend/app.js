const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();

// error Middleware
const errorMiddlerware = require('./middlewares/error');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
   // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// setting up routes
const user = require('./routes/userRoute');
const service = require('./routes/serviceRoutes');
const cart = require('./routes/cartRoutes');
const order = require('./routes/orderRoutes');

app.use('/api/v1/user', user);
app.use('/api/v1/service', service);
app.use('/api/v1/cart', cart);
app.use('/api/v1/order', order);

app.use(errorMiddlerware);

module.exports = app;
