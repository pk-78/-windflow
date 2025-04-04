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
      message: "Something Went Wrong",
      success: false,
      error: error.message,
    });
  }
};


// login logic



export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

   
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
      message: "Internal server error",
      error: error.message,
    });
  }
};



//address update


export const updateAddress = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        mobileNumber,
        fullAddress,
        landmark,
        city,
        state,
        pincode,
      } = req.body;
  
      if (
        !name ||
        !mobileNumber ||
        !fullAddress ||
        !city ||
        !state ||
        !pincode
      ) {
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
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  export const editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, confirmPassword, oldPassword } = req.body;
  
  
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
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
  