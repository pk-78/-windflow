import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    mainImage:{
        url:{type:String, required:true}

    },
    images: [
        {
            url: { type: String }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
