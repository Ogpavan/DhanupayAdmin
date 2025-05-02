import { useRef } from "react";

export default function OTPForm({
  otp,
  onOtpChange,
  onOtpVerify,
  resendTimer,
  canResend,
  onResendOtp,
  error,
  loading,
}) {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    onOtpChange(newOtp);
    if (val && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <form onSubmit={onOtpVerify} className="space-y-5">
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      <div className="text-center text-gray-600 text-sm mb-4">
        Please enter the 6-digit OTP sent to your registered mobile.
      </div>
      <div className="flex justify-between gap-2">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            className="w-12 h-12 text-center border rounded-md text-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Didn’t receive OTP?{" "}
          <button
            type="button"
            className={`text-indigo-600 font-medium hover:underline disabled:opacity-50`}
            onClick={onResendOtp}
            disabled={!canResend}
          >
            {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
          </button>
        </span>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
