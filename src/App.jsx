import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./AdminPages/Dashboard";
import Users from "./AdminPages/Users";
import Transactions from "./AdminPages/Transactions";
import LoginPage from "./auth/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import BasicSettings from "./AdminPages/BasicSettings";
import Profile from "./AdminPages/Profile";
import Commision from "./AdminPages/Commision";

import Registration from "./AdminPages/Registration";
 
import UserDistributor from "./UserPages/UserDistributor";
import UserRetailer from "./UserPages/UserRetailer";
import UserProfile from "./UserPages/UserProfile";
import UserBasicSettings from "./UserPages/UserBasicSettings";
import UserCommission from "./UserPages/UserCommision";
import UserDashboard from "./UserPages/UserDashboard";
import UserTransaction from "./UserPages/UserTransactions";
import UserUsers from "./UserPages/UserUsers";
import UserRegistration from "./UserPages/UserRegistration";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect / to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public/Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private/Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<BasicSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="commission" element={<Commision/>} />
          <Route path="registration" element={<Registration />} />
                  
          <Route path="commission" element={<Commision />} />
          
        </Route>

        {/* Private/User Routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="users" element={<UserUsers />} />
          <Route path="transactions" element={<UserTransaction />} />
          <Route path="settings" element={<UserBasicSettings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="commission" element={<UserCommission />} />
          <Route path="registration" element={<UserRegistration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
