function PreviewPane({ formData, onClose, onSubmit, agreeTerms, setAgreeTerms }) {
  // Sorting the formData entries to place "usertype" at the top
  const sortedEntries = Object.entries(formData).sort(([keyA], [keyB]) => {
    if (keyA.toLowerCase() === "usertype") return -1;
    if (keyB.toLowerCase() === "usertype") return 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="max-h-64 overflow-y-auto border-t border-b border-gray-200 px-5 py-2">
          <ul className="space-y-4">
            {sortedEntries.map(([key, value]) => {
              let content;

              // Determine the content type
              if (value instanceof File) {
                const fileType = value.type.split("/")[0];
                if (fileType === "image") {
                  content = (
                    <img
                      src={URL.createObjectURL(value)}
                      alt={value.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  );
                } else if (fileType === "video") {
                  content = (
                    <video
                      src={URL.createObjectURL(value)}
                      controls
                      className="w-48 h-32 object-cover rounded"
                    />
                  );
                } else {
                  content = <span>{value.name}</span>;
                }
              } else {
                content = <span>{value || "N/A"}</span>;
              }

              return (
                <li key={key} className="flex items-start justify-between">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <div className="ml-4">{content}</div>
                </li>
              );
            })}
          </ul>
        </div>

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
