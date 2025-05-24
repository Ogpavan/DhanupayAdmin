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
import RegistrationuserForm from "./UserPages/RegistrationSteps/RegistrationForm.jsx";
import RegistrationModal from "./AdminPages/RegistrationSteps/RegistrationModal.jsx";
import RegistrationuserModal from "./UserPages/RegistrationSteps/RegistrationModal.jsx";
import BBPSComplaint from "./UserPages/ServicesOnDashboard/BBPSComplaint.jsx";
import Services from "./UserPages/Services.jsx";
import OtherServices from "./UserPages/OtherServices.jsx";
import AEPSServices from "./UserPages/AEPSServices.jsx";
import RechargesAndBillPay from "./UserPages/RechargesAndBillPay.jsx";
import RegisterRetailer from "./auth/RegisterRetailer.jsx";
import EmployeeRegistration from "./AdminPages/EmployeeRegistration.jsx";
import BasicDetails from "./auth/RegisterRetailer/BasicDetails.jsx";
import ResidentialDetails from "./auth/RegisterRetailer/ResidentialDetails.jsx";
import BankDetail from "./auth/RegisterRetailer/BankDetail.jsx";
import AadhaarDetails from "./auth/RegisterRetailer/AadhaarDetails.jsx";
import PanDetails from "./auth/RegisterRetailer/PanDetails.jsx";
import VideoKYC from "./auth/RegisterRetailer/VideoKYC.jsx";
import BusinessDetails from "./auth/RegisterRetailer/BusinessDetails.jsx";
import ServicesPage from "./AdminPages/ServicePage.jsx";
import PageMasterManager from "./AdminPages/PageMasterManager.jsx";
// import AssignServices from "./AdminPages/AssignServices.jsx";

//for setting nested routes
import ManageCity from "./AdminPages/BasicSetting/ManageCity.jsx";
import ManageState from "./AdminPages/BasicSetting/ManageStates.jsx";
import ManageRole from "./AdminPages/BasicSetting/ManageRole.jsx";
import ManageDesignation from "./AdminPages/BasicSetting/ManageDesignation.jsx";
import ManageUsertype from "./AdminPages/BasicSetting/ManageUsertype.jsx";
import ManageDepartment from "./AdminPages/BasicSetting/ManageDepartment.jsx";
import EmployeePermission from "./AdminPages/EmployeePermission.jsx";
import Commission from "./AdminPages/Commision";
import Commissionmaster from "./AdminPages/Commission/Commissionmaster.jsx";
import BankMaster from "./AdminPages/BankMaster.jsx";



function App() {
  return (
    <LoaderProvider>
      <GlobalLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/administrator" element={<AdminLoginPage />} />
          <Route path="/otp" element={<OTPForm />} />
          <Route path="/forgot-mpin" element={<ForgotMpin />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/admin-forgot-password"
            element={<AdminForgotPasswordPage />}
          />
          <Route path="/setup-mpin" element={<SetupMpinPage />} />
          <Route path="/registerretailer" element={<RegisterRetailer />} />

          <Route path="/basic-details" element={<BasicDetails />} />
          <Route path="/business-details" element={<BusinessDetails />} />
          <Route path="/residential-details" element={<ResidentialDetails />} />
          <Route path="/bank-detail" element={<BankDetail />} />
          <Route path="/aadhaar-details" element={<AadhaarDetails />} />
          <Route path="/pan-details" element={<PanDetails />} />
          <Route path="/video-kyc" element={<VideoKYC />} />


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
              <Route path="commissionmaster" element={<Commissionmaster />} />
              <Route path="/admin/settings" element={<BasicSettings />}>
                <Route path="city" element={<ManageCity />} />
                <Route path="state" element={<ManageState />} />
                <Route path="department" element={<ManageDepartment />} />
                <Route path="designation" element={<ManageDesignation />} />
                <Route path="usertype" element={<ManageUsertype />} />
                <Route path="role" element={<ManageRole />} />
              </Route>
              <Route path="profile" element={<Profile />} />
              <Route path="commission" element={<Commision />} />
              <Route path="registration" element={<RegistrationForm />} />
              <Route path="financial" element={<Financial />} />
              <Route path="employeemaster" element={<EmployeeMaster />} />
              <Route path="bankmaster" element={<BankMaster />} />
              <Route path="fundtransfer" element={<FundTransfer />} />
              <Route
                path="UserTypeAndRoleManager"
                element={<UserTypeAndRoleManager />}
              />
              <Route path="ServiceMaster" element={<ServiceMaster />} />
              <Route path="servicepage" element={<ServicesPage />} />
              <Route path="loadwallet" element={<LoadWallet />} />
              <Route path="registrationmodal" element={<RegistrationModal />} />
              {/* <Route path="assignservices" element={<AssignServices />} /> */}
          <Route
                path="employeeregistration"
                element={<EmployeeRegistration />}
              />
              <Route path="pagemastermanager" element={<PageMasterManager />} />
              <Route path="employeepermission" element={<EmployeePermission />} />
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
            <Route path="registration" element={<RegistrationuserForm />} />

            <Route path="userRegistration" element={<RegistrationuserModal />} />
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
            {/* <Route path="registration" element={<UserRegistration />} /> */}
            <Route path="reports" element={<UserReports />} />
            <Route path="financials" element={<Financials />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="reportviewer" element={<ReportViewer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
