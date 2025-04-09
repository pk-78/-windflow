import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
