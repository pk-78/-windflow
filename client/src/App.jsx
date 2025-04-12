// Ad

import { Route, Routes } from "react-router-dom";
import AdminLogin from "./Admin/pages/AdminLogin";
import AdminReset from "./Admin/pages/AdminReset";
import AdminSignupPage from "./Admin/pages/AdminSignUp";
import Navbar from "./Admin/pages/Navbar";
import UserLogin from "./User/Page/UserLogin";
import UserReset from "./User/Page/UserReset";
import UserSignupPage from "./User/Page/UserSignUp";
import UserHomePage from "./User/Page/UserHomePage";
import { Toaster } from "react-hot-toast";
import AdminHomePage from "./Admin/pages/AdminHomePage";
import ViewOrder from "./Admin/pages/ViewOrder";
import AddProduct from "./Admin/pages/AddProduct";
import AllProduct from "./Admin/pages/AllProduct";

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/userLogin" element={<UserLogin />} />

        <Route path="/userSignup" element={<UserSignupPage />} />

        <Route path="/userReset" element={<UserReset />} />
        <Route path="/home/:id" element={<UserHomePage />} />
      </Routes>
      <Routes>
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminSignup" element={<AdminSignupPage />} />
        <Route path="/adminReset" element={<AdminReset />} />
        <Route path="/adminHome" element={<AdminHomePage />} />
        <Route path="/viewOrder/:id" element={<ViewOrder />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/allProduct" element={<AllProduct />} />
      </Routes>
    </>
  );
}

export default App;
