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
import { LoaderProvider } from "./context/LoaderContext.jsx";
import GlobalLoader from "./components/GlobalLoader";
import UserReports from "./UserPages/UserReports";
import EmployeeMaster from "./AdminPages/EmployeeMaster.jsx";
import Financials from "./UserPages/Financial/Financials.jsx";
import Wallet from "./UserPages/Wallet.jsx";
import FundTransfer from "./AdminPages/FundTransfer/FundTransfer.jsx";
import OTPForm from "./auth/OTPForm.jsx";
import ForgotMpin from "./auth/ForgotMpin.jsx";
import SetupMpinPage from "./auth/SetupMpinPage.jsx";
import ReportViewer from "./UserPages/ReportViewer/Reportviewer.jsx";
import UserTypeAndRoleManager from "./AdminPages/UserTypeAndRoleManager.jsx";
 
import AdminLoginPage from "./auth/AdminLoginPage.jsx";
 import AdminForgotPasswordPage from "./auth/AdminForgotPasswordPage.jsx";
import ServiceMaster from "./AdminPages/ServiceMaster.jsx";
import LoadWallet from "./AdminPages/LoadWallet.jsx";
import RegistrationForm from "./AdminPages/RegistrationSteps/RegistrationForm.jsx";
import RegistrationModal from "./AdminPages/RegistrationSteps/RegistrationModal.jsx";
import BBPSComplaint from "./UserPages/ServicesOnDashboard/BBPSComplaint.jsx";
import Services from "./UserPages/Services.jsx";
import OtherServices from "./UserPages/OtherServices.jsx";
import AEPSServices from "./UserPages/AEPSServices.jsx";
import RechargesAndBillPay from "./UserPages/RechargesAndBillPay.jsx";

function App() {
  return (
    <LoaderProvider >
      <GlobalLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/administrator" element={<AdminLoginPage />} />
          <Route path="/otp" element={<OTPForm />} />
          <Route path="/forgot-mpin" element={<ForgotMpin />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/admin-forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/setup-mpin" element={<SetupMpinPage />} />
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
            <Route path="registration" element={<RegistrationForm />} />
            <Route path="financial" element={<Financial />} />
            <Route path="employeemaster" element={<EmployeeMaster />} />
            <Route path="fundtransfer" element={<FundTransfer />} />
            <Route path="UserTypeAndRoleManager" element={<UserTypeAndRoleManager />} /> 
            <Route path="ServiceMaster" element={<ServiceMaster />} />
            <Route path="loadwallet" element={<LoadWallet />} />
            <Route path="registrationmodal" element={<RegistrationModal />} />
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
            <Route path="rechargecomplaint" element={<BBPSComplaint />} />
            <Route path="users" element={<UserUsers />} />
            {/* <Route path="services" element={<Services />} /> */}

            <Route path="services" element={<Services />}>
              <Route path="recharges" element={<RechargesAndBillPay />} />
              <Route path="aeps" element={<Financials />} />
              {/* <Route path="aeps" element={<AEPSServices />} /> */}
              <Route path="OthersServices" element={<OtherServices />} />
            </Route>

            <Route path="transactions" element={<UserTransaction />} />
            <Route path="settings" element={<UserBasicSettings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="commission" element={<UserCommission />} />
            <Route path="registration" element={<UserRegistration />} />
            <Route path="reports" element={<UserReports />} />
            <Route path="financials" element={<Financials />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="reportviewer" element={<ReportViewer />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </LoaderProvider >
  );
}

export default App;
