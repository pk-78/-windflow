import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllProduct } from "../redux/productSlice";
import axios from "axios";
import url from "../url/url";
import toast from "react-hot-toast";

export default function useGetAllProduct() {
  // const { allProduct} = useSelector((state)=>state.product)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/product/getAllProduct`);
        // setAllProduct(response?.data?.products || []);
        dispatch(setAllProduct(response?.data?.products || []));
        toast.success("Products Fetched Successfully");
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong Please Try Again Later");
      }
    };

    fetchAllProduct();
  }, []);
//   return <div>useGetAllProduct</div>;
}
