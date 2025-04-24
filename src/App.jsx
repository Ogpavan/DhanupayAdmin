import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import LoginPage from "./auth/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import BasicSettings from "./pages/BasicSettings";
import Profile from "./pages/Profile";
import Commision from "./pages/Commision";
import RetailerRegistration from "./pages/Retailer";
import DistributorRegistration from "./pages/Distributor";

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
          path="/"
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
          <Route path="retailer" element={<RetailerRegistration />} />
          <Route path="distributor" element={<DistributorRegistration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
