const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// address schema
const addressSchema = new mongoose.Schema({
  city: {
    type: "String",
    required: [true, "Please enter city name"],
  },
  district: {
    type: "String",
    required: [true, "Please enter district name"],
  },
  state: {
    type: "String",
    required: [true, "Please enter state name"],
  },
  country: {
    type: "String",
    required: [true, "Please enter country name"],
  },
  pincode: {
    type: Number,
    required: [true, "Please enter pincode"],
  },
});

// professional Schema
const professionalSchema = new mongoose.Schema({
  about: {
    type: String,
    required: [true, "Please enter your bio"],
  },
  specialization: {
    type: String,
    required: [true, "Please enter your specialization"],
  },
  experience: {
    type: String,
    required: [true, "Please enter your experience"],
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  orders: [
    {
      order: {
        type: mongoose.Schema.ObjectId,
        ref: "order",
        required: true
      }
    }
  ],
  totalEarnings: {
    type: Number,
    default: 0
  },
  ordersCompleted: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    minlength: [4, "Name must have more than 4 characters"],
    maxlength: [30, "Name must not have more than 30 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email-id"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must not have less than 8 characters"],
  },
  gender: {
    type: String,
  },
  phoneno: {
    type: Number,
    validate(value) {
      return validator.isMobilePhone(value.toString());
    },
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  address: addressSchema,
  professional: professionalSchema,
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  expirePasswordToken: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  } else {
    next();
  }
});

// generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// checking password matching
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// generating reset password token
userSchema.methods.getResetPasswordToken = function () {
  // generating a token randomly
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.expirePasswordToken = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("user", userSchema);
