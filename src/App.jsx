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

import UserProfile from "./UserPages/UserProfile";
import UserBasicSettings from "./UserPages/UserBasicSettings";
import UserCommission from "./UserPages/UserCommision";
import UserDashboard from "./UserPages/UserDashboard";
import UserTransaction from "./UserPages/UserTransactions";
import UserUsers from "./UserPages/UserUsers";
import UserRegistration from "./UserPages/UserRegistration";
import Financial from "./AdminPages/Financial";
import { LoaderProvider  } from "./context/LoaderContext.jsx";
import GlobalLoader from "./components/GlobalLoader";
import UserReports from "./UserPages/UserReports";

function App() {
  return (
    <LoaderProvider >
      <GlobalLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
            <Route path="registration" element={<Registration />} />
            <Route path="financial" element={<Financial />} />
          </Route>

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
            <Route path="reports" element={<UserReports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoaderProvider >
  );
}

export default App;
