import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userSignup = async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        success: false,
        message: "Some Field Is Missing",
      });
    }
    const emailUser = await User.findOne({ email });
    console.log(emailUser);
    if (emailUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });
    }
    const phoneUser = await User.findOne({ phone });
    if (phoneUser) {
      return res.status(409).json({
        success: false,
        message: "Phone already exist",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match with confirm Password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,

      phone,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong in user Signup",
      success: false,
      error: error.message,
    });
  }
};

// login logic

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in user login",
      error: error.message,
    });
  }
};

//address update

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobileNumber, fullAddress, landmark, city, state, pincode } =
      req.body;

    if (!name || !mobileNumber || !fullAddress || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Some Data is Missing",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          address: {
            name,
            mobileNumber,
            fullAddress,
            landmark,
            city,
            state,
            pincode, // match with your schema field
          },
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedUser.address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in update Address",
      error: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confirmPassword, oldPassword } = req.body;
  console.log(password, oldPassword, confirmPassword);
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.phone || req.body.address) {
      return res.status(400).json({
        success: false,
        message: "You cannot change phone number or address",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password && confirmPassword && oldPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in edit user",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const intQuantity = Number(quantity);

    const existingItem = user.cart.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      // Update quantity if product already in cart
      existingItem.quantity += intQuantity;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const orderProduct = async (req, res) => {
  const { id } = req.params;

  const { productId, quantity, orderStatus } = req.body;

  try {
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          orders: {
            productId,
            quantity,
            orderStatus,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product is added to cart",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in add To Cart",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched Successfully",
      orders: user.orders,
    });
  } catch (error) {
    console.log("Get All Order", error);
    return res.status(500).json({
      message: "Something went wrong in Get All Order",
      error: error.message,
    });
  }
};
export const changeOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { productId, status } = req.body;
  console.log(status)
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this id",
      });
    }
    if (!productId || !status) {
      return res.status(400).json({
        success: false,
        message: "Product Id or status not found",
      });
    }

    const filterProduct = user.orders.filter(
      (singleProduct) => singleProduct._id !== productId
    );
    filterProduct[0].orderStatus = status;

    console.log(filterProduct);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "found successfuly",
      order: user.orders

    });
  } catch (error) {
    console.log("change order status", error);
    return res.status(500).json({
      message: "Something went wrong in change order status",
      error: error.message,
    });
  }
};
