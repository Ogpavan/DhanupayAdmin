function PreviewPane({ formData, onClose, onSubmit, agreeTerms, setAgreeTerms }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <ul className="space-y-2">
          {Object.entries(formData).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
              <span>{value instanceof File ? value.name : value || "N/A"}</span>
            </li>
          ))}
        </ul>

        {/* Terms & Conditions */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={() => setAgreeTerms((prev) => !prev)}
            className="mr-2"
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-700">
            I agree to the Terms and Conditions
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (agreeTerms) onSubmit();
              else alert("Please agree to the terms and conditions.");
            }}
            className={`px-4 py-2 rounded-lg shadow ${
              agreeTerms ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-200"
            }`}
            disabled={!agreeTerms}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPane;