 
import BasicDetails from "./RegisterRetailer/BasicDetails";
import loginpageimage from "/LoginPageImage.png";
 

export default function registerretailer() {
 
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="Login Illustration"
          className="max-w-md w-full"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <BasicDetails />
       </div>
    </div>
  );
}
