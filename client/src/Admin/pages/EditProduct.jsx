import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../url/url";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    originalPrice: "",
    stock: "",
    mainImage: null,
    multipleImages: [],
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState(null);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [multipleImagePreviews, setMultipleImagePreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/product/getProduct/${id}`);
        const product = response?.data?.product;
        setProductDetail(product);
  
        // Set form fields with fetched data
        setFormData({
          name: product.name || "",
          category: product.category || "",
          originalPrice: product.originalPrice || "",
          stock: product.stock || "",
          mainImage: null, // We'll keep this null so user can optionally update it
          multipleImages: [], // Same here
        });
  
        setMainImagePreview(product?.mainImage?.url || null);
        const urls = product?.images?.map((img) => img.url);
        setMultipleImagePreviews(urls || []);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, mainImage: file });
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, multipleImages: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setMultipleImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("category", formData.category);
    form.append("originalPrice", formData.originalPrice);
    form.append("stock", formData.stock);
    form.append("mainImage", formData.mainImage);
    formData.multipleImages.forEach((file) => form.append("images", file));

    console.log("Submitted Data:", formData);


    setLoading(true);

    try {
      const response = await axios.put(
        `${url}/api/v1/product/updateProduct/${id}`,
        form
      );
      console.log(response);
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
    setFormData({
      name: "",
      category: "",
      originalPrice: "",
      stock: "",
      mainImage: null,
      multipleImages: [],
    });
    setMainImagePreview(null);
    setMultipleImagePreviews([]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Available
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              required
              className="block w-full text-sm text-gray-100 bg-green-500 p-2 rounded-md cursor-pointer"
            />
            {mainImagePreview && (
              <img
                src={mainImagePreview}
                alt="Main Preview"
                className="mt-2 h-40 rounded border object-contain"
              />
            )}
          </div>

          {/* Multiple Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Multiple Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesChange}
              className="block w-full text-sm text-gray-100 cursor-pointer bg-green-500 p-2 rounded-md"
            />
            {multipleImagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {multipleImagePreviews.map((url, idx) => (
                  <img
                    key={idx}
                    src={url }
                    alt={`Preview ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white cursor-pointer font-medium rounded hover:bg-blue-700 transition"
            >
              {loading ? "Updating...." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
