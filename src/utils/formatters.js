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

export const getCurrentSession = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 is Jan, 8 is Sept)

  // Assuming a new session starts around September (Month 8)
  // If it's before September, the session started last year.
  if (currentMonth < 8) {
    return `Academic Session ${currentYear - 1}/${currentYear}`;
  } else {
    return `Academic Session ${currentYear}/${currentYear + 1}`;
  }
};

export const TABS = [
  { id: "elections", label: "Elections", icon: "Calendar", color: "blue" },
  { id: "positions", label: "Positions", icon: "FileText", color: "green" },
  { id: "candidates", label: "Candidates", icon: "Users", color: "purple" },
  { id: "votes", label: "Votes", icon: "Vote", color: "orange" },
  { id: "abuse", label: "Security Logs", icon: "ShieldAlert", color: "red" },
];

export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function parseDatetimeLocal(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, "0");

  const localYear = d.getFullYear();
  const localMonth = pad(d.getMonth() + 1);
  const localDate = pad(d.getDate());
  const localHours = pad(d.getHours());
  const localMinutes = pad(d.getMinutes());

  return `${localYear}-${localMonth}-${localDate}T${localHours}:${localMinutes}`;
}

export function toLocalDatetimeString(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Add days in local time
export function addDaysLocal(datetimeLocalString, days = 1) {
  if (!datetimeLocalString) return "";
  const [datePart, timePart] = datetimeLocalString.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min] = timePart.split(":").map(Number);
  const dt = new Date(y, m - 1, d + days, h, min); // local date
  const pad = (n) => n.toString().padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}
