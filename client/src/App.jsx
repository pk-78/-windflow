// Ad

import AdminLogin from "./Admin/pages/AdminLogin";
import LoginPage from "./Admin/pages/AdminLogin";
import AdminSignupPage from "./Admin/pages/AdminSignUp";
import UserLogin from "./User/Page/UserLogin";
import UserSignupPage from "./User/Page/UserSignUp";




function App() {
  

  return (
    <>
     <AdminLogin/>
     <AdminSignupPage/>
     <UserSignupPage/>
     <UserLogin/>
    </>
  );
}

export default App;
