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

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/adminSignup" element={<AdminSignupPage />} />
        <Route path="/userSignup" element={<UserSignupPage />} />
        <Route path="/adminReset" element={<AdminReset />} />
        <Route path="/userReset" element={<UserReset />} />
        <Route path="/home/:id" element={<UserHomePage />} />
        <Route path="/adminHome/:id" element={<AdminHomePage />} />
      </Routes>
    </>
  );
}

export default App;
