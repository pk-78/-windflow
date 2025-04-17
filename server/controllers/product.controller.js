import dotenv from "dotenv";
import Product from "../models/product.model.js";
dotenv.config();

export const addProduct = async (req, res) => {
  const { name, originalPrice, category, stock } = req.body;
  console.log("aaya kay");
  try {
    // Handle mainImage
    const mainImageUrl = req.files["mainImage"]?.[0]?.path;
    if (!mainImageUrl) {
      return res.status(400).json({ error: "Main image is required" });
    }

    // Handle additional images
    const images = (req.files["images"] || []).map((file) => ({
      url: file.path,
    }));

    // Create product
    const newProduct = new Product({
      name,
      originalPrice,
      category,
      stock,
      mainImage: { url: mainImageUrl },
      images,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Server error while creating product" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // optional: newest first
    res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to get products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(404).json({
        success: true,
        message: "No id found",
      });
    }

    const product = await Product.findById(id);
    return res.status(200).json({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in find product by id controller",
      error: error.message,
    });
  }
};

export const editProduct = async (req, res) => {
  const { name, originalPrice, category, stock } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields
    product.name = name || product.name;
    product.originalPrice = originalPrice || product.originalPrice;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    // Update mainImage if provided
    const mainImageUrl = req.files?.["mainImage"]?.[0]?.path;
    if (mainImageUrl) {
      product.mainImage = { url: mainImageUrl };
    }

    // Update multiple images if provided
    const images = req.files?.["images"] || [];
    if (images.length > 0) {
      product.images = images.map((file) => ({ url: file.path }));
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Edit product error:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error while updating product" });
  }
};


