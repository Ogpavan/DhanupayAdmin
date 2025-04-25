import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import RetailerRegistration from "./AdminPages/Retailer";
import UserDistributor from "./UserPages/UserDistributor";
import UserRetailer from "./UserPages/UserRetailer";
import 
import DistributorRegistration from "./AdminPages/Distributor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="commission" element={<Commision />} />
          <Route path="retailer" element={<RetailerRegistration />} />
          <Route path="distributor" element={<DistributorRegistration />} />
        </Route>

        {/* Private/User Routes (Same as Admin) */}
        <Route
          path="/user"
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
          <Route path="commission" element={<Commision />} />
          <Route path="retailer" element={<RetailerRegistration />} />
          <Route path="distributor" element={<UserDistributor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
