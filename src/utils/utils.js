// src/utils/utils.js
import CryptoJS from 'crypto-js';

export const generateHMAC = async () => {
  const nonce = CryptoJS.lib.WordArray.random(16).toString(); 
  const timestamp = Date.now();
  const message = nonce + timestamp;
  const enc = new TextEncoder();
  const secretKey = import.meta.env.VITE_API_URL; 
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const hmac = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const hexHmac = Array.from(new Uint8Array(hmac), byte => byte.toString(16).padStart(2, "0")).join("");

  return { nonce, timestamp, hmac: hexHmac };
};
