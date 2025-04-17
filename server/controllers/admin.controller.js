import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/product.model.js";
dotenv.config();

export const adminSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Some Field Is Missing",
      });
    }
    const emailUser = await Admin.findOne({ email });
    if (emailUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match with confirm Password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(200).json({
      success: true,
      message: "Admin Created Successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong in admin signup",
      success: false,
      error: error.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Either Email or Password is wrong",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Either Email or Password is wrong",
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role:admin.role
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in admin login",
      error: error.message,
    });
  }
};

export const editAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, oldPassword, password, confirmPassword } = req.body;
  console.log(name, oldPassword, password, confirmPassword);
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: "You cannot update email or phone number",
      });
    }

    if (name) admin.name = name;

    // Update password if oldPassword, new password and confirmPassword are all provided
    if (oldPassword && password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password do not match",
        });
      }
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
      data: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in edit admin",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const getAllOrders = await Order.find();

    if (!getAllOrders) {
      return res.status(400).json({
        success: false,
        message: "No orders Found",
      });
    }

    return res.status(200).json({
      success: true,
      messgae: "orders Fetched Successfully",
      getAllOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "pending" });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "No pending Order found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Pending orders found",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending orders",
      error: error.message,
    });
  }
};
export const getShippedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "shipped" });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "No Shipped Order found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Pending Shipped found",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Shipped orders",
      error: error.message,
    });
  }
};
export const getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "delivered" });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "No delivered Order found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Delivered orders found",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivered orders",
      error: error.message,
    });
  }
};
export const getCancelledOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "cancelled" });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "No Cancelled Order found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cancelled orders found",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cancelled orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  // const { productId, customerId } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "No order found",
      });
    }

    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await User.findById(order.customerId).select("-password -cart");
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order found successfully",
      customer,
      product,
      order,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const changeOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID or status not found",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true } // This returns the updated document
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status changed successfully",
      order,
    });
  } catch (error) {
    console.log("change order status", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in change order status",
      error: error.message,
    });
  }
};

export const getAllProduct=async(req,res)=>{
  try {
    const allProducts= await Product.find()
    if(!allProducts){
      return res.status(400).json({
        success:false,
        messgae:"No products found"
      })
    } 

    return res.status(200).json({
      success:true,
      message:"Products fetched Sucessfully",
      allProducts
    })
  } catch (error) {
    console.log("Error in get All product controller",error )
    return res.status(500).json({
      success:false,
      message:"something went wrong",
      error:error.message
    })
    
  }
} 
