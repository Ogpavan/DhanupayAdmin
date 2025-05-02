import { useState } from "react";
import { Lock, Eye, EyeSlash } from "phosphor-react";

export default function SetMpinForm({ onSetMpin, error, loading }) {
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [showMpin, setShowMpin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSetMpin({ newMpin, confirmMpin });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      <div className="text-center text-gray-600 text-sm mb-4">
        Set your new 6-digit MPIN
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type={showMpin ? "text" : "password"}
          placeholder="Setup New MPIN"
          className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          value={newMpin}
          maxLength={6}
          inputMode="numeric"
          onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, ""))}
        />
        <button
          type="button"
          onClick={() => setShowMpin(!showMpin)}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showMpin ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type={showMpin ? "text" : "password"}
          placeholder="Confirm MPIN"
          className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          value={confirmMpin}
          maxLength={6}
          inputMode="numeric"
          onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
        disabled={loading}
      >
        {loading ? "Saving..." : "Set MPIN"}
      </button>
    </form>
  );
}
