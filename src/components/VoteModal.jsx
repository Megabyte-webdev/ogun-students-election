import React, { useState } from "react";
import Modal from "./Modal";
import PositionVoteCard from "./PositionVoteCard";

export default function VoteModal({ election, onClose }) {
  const [step, setStep] = useState(1); // 1: User Details, 2: Biometric, 3: Vote
  const [user, setUser] = useState({ matricNo: "", deviceId: "" });
  const [biometricType, setBiometricType] = useState("fingerprint");
  const [biometricPayload, setBiometricPayload] = useState(null);
  const [error, setError] = useState("");

  /** Step 1: Validate matric/device */
  const handleNextFromDetails = () => {
    if (!user.matricNo || !user.deviceId) {
      setError("Enter matric number and device ID.");
      return;
    }
    setError("");
    setStep(2);
  };

  /** Step 2: Simulate biometric scan (replace with WebAuthn or actual biometric capture) */
  const handleNextFromBiometric = async () => {
    setError("");
    try {
      // Simulate scan
      const payload = await new Promise((resolve) =>
        setTimeout(() => resolve(`${biometricType}_sample_hash_123`), 1000),
      );
      setBiometricPayload(payload);
      setStep(3);
    } catch {
      setError("Biometric scan failed. Try again.");
    }
  };

  return (
    <Modal open={!!election} onClose={onClose}>
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Enter Your Details</h2>
          {error && <p className="text-red-600">{error}</p>}
          <input
            type="text"
            placeholder="Matric Number"
            value={user.matricNo}
            onChange={(e) => setUser({ ...user, matricNo: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Device ID"
            value={user.deviceId}
            onChange={(e) => setUser({ ...user, deviceId: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleNextFromDetails}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Biometric Verification</h2>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="fingerprint"
                checked={biometricType === "fingerprint"}
                onChange={(e) => setBiometricType(e.target.value)}
              />
              Fingerprint
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="face"
                checked={biometricType === "face"}
                onChange={(e) => setBiometricType(e.target.value)}
              />
              Face ID
            </label>
          </div>
          <button
            onClick={handleNextFromBiometric}
            className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Scan {biometricType === "fingerprint" ? "Fingerprint" : "Face"}
          </button>
        </div>
      )}

      {step === 3 && (
        <PositionVoteCard
          electionId={election.id}
          user={{ ...user, biometricType, biometricPayload }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
