import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Order from "../models/orders.model.js";
import Product from "../models/product.model.js";
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

export const getUserAddress = async(req, res)=>{

  const {id}= req.params;
  try {

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    return res.status(200).json({
      success:true,
      message:"Address Fetched Successfully",
      address:user.address
    })

    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in user getting address",
      error: error.message,
    });
    
  }
}
//address update

export const updateAddress = async (req, res) => {
  const { id } = req.params;
    const { name, mobileNumber, fullAddress, landmark, city, state, pincode } =
      req.body;
  console.log( name,mobileNumber, fullAddress, landmark, city, state, pincode)
  try {
    

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

export const getUserCartDetail = async () => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart found",
      cart: user.cart,
    });
  } catch (error) {
    console.log("Something Went wrong");
    return res.status(500).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingItemIndex = user.cart.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (existingItemIndex !== -1) {
      user.cart.splice(existingItemIndex, 1);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Item Removed successfully",
        cart: user.cart,
      });
    } else {
      user.cart.push({ productId, quantity: 1 });
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Item Added successfully",
        cart: user.cart,
      });
    }
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
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Create new order
    const newOrder = new Order({
      customerId: id,
      productId,
      quantity,
      orderstatus: "pending",
    });

    await newOrder.save();

    // Find user and push order ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.orders.push(newOrder._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product ordered successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while ordering product",
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
export const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { productId, status } = req.body;
  console.log(status);
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
      (singleProduct) => singleProduct.productId !== productId
    );
    filterProduct[0].orderStatus = status;

    console.log(filterProduct);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "found successfuly",
      order: user.orders,
    });
  } catch (error) {
    console.log("change order status", error);
    return res.status(500).json({
      message: "Something went wrong in change order status",
      error: error.message,
    });
  }
};
export const getCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Card Item Found ",
      cartItem: user.cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Card Item Found ",
      orderHistory: user.orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getOrderHistoryById = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      message: "Order found successfully",

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
