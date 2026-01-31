// VoteModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import PositionVoteCard from "./PositionVoteCard";
import {
  Fingerprint,
  ShieldCheck,
  CreditCard,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  extractErrorMessage,
  getOrCreateDeviceId,
  MATRIC_REGEX,
  runWebAuthnScan,
} from "../utils/formatters";
import MatricInput from "./MatricInput";

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
    if (!MATRIC_REGEX.test(matricNo)) {
      setError("Please enter a valid format (e.g., EES/24/25/0000)");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBiometricScan = async () => {
    setError("");
    setScanning(true);
    try {
      const hash = await runWebAuthnScan();
      setBiometricPayload(hash);
      setStep(3);
    } catch (err) {
      setError(
        extractErrorMessage(err) ||
          "Biometric authentication failed. Ensure your device is ready.",
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <Modal open={!!election} onClose={onClose}>
      <div className="p-2">
        {/* --- STEPPER --- */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  step >= s
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {step > s ? (
                  <ShieldCheck size={16} />
                ) : (
                  <span className="text-xs font-black">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-indigo-600" : "bg-slate-100"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-2">
                <CreditCard size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Identify Yourself
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Enter your official matriculation number to begin.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Matric Number
              </label>
              <MatricInput value={matricNo} onChange={setMatricNo} />
              {error && (
                <p className="text-red-500 text-[11px] font-bold italic text-center">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleNextFromDetails}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 shadow-xl transition-all active:scale-95"
            >
              Verify Identity <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: BIOMETRICS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="space-y-2">
              <div
                className={`inline-flex p-6 rounded-[2.5rem] mb-2 transition-colors duration-500 ${
                  scanning
                    ? "bg-indigo-600 text-white animate-pulse"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {scanning ? (
                  <Loader2 size={48} className="animate-spin" />
                ) : (
                  <Fingerprint size={48} />
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Biometric Lock
              </h2>
              <p className="text-slate-500 text-sm font-medium max-w-60 mx-auto">
                Secure your ballot using FaceID, TouchID, or your device
                passcode.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBiometricScan}
                disabled={scanning}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {scanning ? "Initializing Scanner..." : "Authenticate Now"}
              </button>

              <button
                onClick={() => {
                  setBiometricType("none");
                  setStep(3);
                }}
                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors py-2"
              >
                Skip Biometrics (Reduced Security)
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BALLOT */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <PositionVoteCard
              electionId={election?.id}
              user={{ matricNo, deviceId, biometricType, biometricPayload }}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
