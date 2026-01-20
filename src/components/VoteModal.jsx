import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import PositionVoteCard from "./PositionVoteCard";

const MATRIC_REGEX = /^[A-Z]{3}\/\d{2}\/\d{2}\/\d{4}$/;

function getOrCreateDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

async function runWebAuthnScan() {
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
      userVerification: "required",
    },
  });

  const raw = new Uint8Array(credential.response.authenticatorData);
  const hashBuffer = await crypto.subtle.digest("SHA-256", raw);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function VoteModal({ election, onClose }) {
  const [step, setStep] = useState(1);
  const [matricNo, setMatricNo] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [biometricType, setBiometricType] = useState("fingerprint");
  const [biometricPayload, setBiometricPayload] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  const handleNextFromDetails = () => {
    if (!matricNo.trim()) {
      setError("Matric number is required.");
      return;
    }

    if (!MATRIC_REGEX.test(matricNo.trim())) {
      setError("Invalid matric format. Example: EES/21/22/0093");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleBiometricScan = async () => {
    setError("");
    setScanning(true);

    try {
      if (!window.PublicKeyCredential) {
        throw new Error("Biometric authentication not supported.");
      }

      const hash = await runWebAuthnScan();
      setBiometricPayload(hash);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Biometric scan failed. Try again or use fallback.");
    } finally {
      setScanning(false);
    }
  };

  const handleFallback = () => {
    setBiometricType("none");
    setBiometricPayload(null);
    setStep(3);
  };

  return (
    <Modal open={!!election} onClose={onClose}>
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Enter Your Matric Number</h2>

          {error && <p className="text-red-600">{error}</p>}

          <input
            type="text"
            placeholder="EES/21/22/0093"
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleNextFromDetails}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Biometric Verification</h2>

          {error && <p className="text-red-600">{error}</p>}

          <p className="text-gray-600">
            Verify your identity using your device biometrics.
          </p>

          <button
            onClick={handleBiometricScan}
            disabled={scanning}
            className={`w-full py-2 rounded text-white ${
              scanning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {scanning ? "Scanning..." : "Scan Fingerprint / Face ID"}
          </button>

          <button
            onClick={handleFallback}
            className="w-full text-sm text-gray-500 underline"
          >
            My device does not support biometrics
          </button>
        </div>
      )}

      {step === 3 && (
        <PositionVoteCard
          electionId={election.id}
          user={{
            matricNo,
            deviceId,
            biometricType,
            biometricPayload,
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
      }
