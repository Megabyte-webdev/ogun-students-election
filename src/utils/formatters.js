export const extractErrorMessage = (error) => {
  const getString = (data) => {
    return typeof data === "string" ? data : JSON.stringify(data);
  };

  // Type guard to check if error is an object with 'response'
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null
  ) {
    const response = error.response;
    if (response.data?.message) {
      return getString(response.data.message);
    }
    if (response.data?.error) {
      return getString(response.data.error);
    }
    if (response.error) {
      return getString(response.error);
    }
  }

  return getString(error?.message || "An unknown error occurred");
};

export const MATRIC_REGEX = /^[A-Z]{3}\/\d{2}\/\d{2}\/\d{4}$/;

export function getOrCreateDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

export async function runWebAuthnScan() {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn not supported.");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Voting System" },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: "voter",
        displayName: "Voter",
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        userVerification: "required",
      },
      timeout: 60000,
    },
  });

  const raw = new Uint8Array(credential.response.attestationObject);
  const hashBuffer = await crypto.subtle.digest("SHA-256", raw);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
