import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },
    addedProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            addedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
