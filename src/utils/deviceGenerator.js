// AltAmino Official Device ID & Header Generator
// Conforms to AltAmino DeviceProcessor with Prefix 0x19 and HMAC-SHA1

const VERIFIED_DEVICE_IDS = [
  "1943B6BB6A8793D0F43699C46E0332A4F8A062C33DCE37EADD07709A3663A81B77A015123CAE36F289",
  "192F9F0E907AF9740E21F2E40FBD9922FC1A89720135E5FF1EB8E3018E88A118A66963FAF14529DD7B",
  "19791DB84814D51AA422F54C230AD9F04A8A6EEBEB2173D28B3147E21BCC4CCC8EB6D44E1EE6FAD672",
  "1972B2EFA6E80F5DE2923E9701378C919A5B3A66FF0591905423BE1814744A17B0D68A85A5695BFEE2",
  "19C4DFAB5D16DC4C4ACFF184FBE80077B787E0BE365FE6BF5F4BD0FFE8A4D8D3AD8ACCC0F8D0AEB20D"
];

const SIG_KEY_HEX = "DFA5ED192DDA6E88A12FE12130DC6206B1251E44";

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Returns a persistent, verified AltAmino NDCDEVICEID
 */
export function getOrCreateDeviceId() {
  let savedId = localStorage.getItem('altamino_ndc_device_id');
  if (!savedId) {
    savedId = VERIFIED_DEVICE_IDS[Math.floor(Math.random() * VERIFIED_DEVICE_IDS.length)];
    localStorage.setItem('altamino_ndc_device_id', savedId);
  }
  return savedId;
}

/**
 * Generates official NDC-MSG-SIG using Web Crypto API
 * @param {string} bodyString
 * @returns {Promise<string>}
 */
export async function generateNdcSignature(bodyString) {
  try {
    const keyBytes = hexToBytes(SIG_KEY_HEX);
    const dataBytes = new TextEncoder().encode(bodyString || "");

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, dataBytes);
    const sigBytes = new Uint8Array(signatureBuffer);

    // Prefix with \x19 (0x19)
    const fullBytes = new Uint8Array(1 + sigBytes.length);
    fullBytes[0] = 0x19;
    fullBytes.set(sigBytes, 1);

    let binary = '';
    for (let i = 0; i < fullBytes.length; i++) {
      binary += String.fromCharCode(fullBytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.warn("[NDC Signature] Fallback signature error:", err);
    return "GXMijS1T7S8EI1s3iNMah4fb9m5t";
  }
}

/**
 * Returns NDC headers required by AltAmino live server
 */
export async function getLiveHeaders(sid = null, bodyString = null) {
  const headers = {
    'Content-Type': 'application/json',
    'NDCDEVICEID': getOrCreateDeviceId(),
    'NDCLANG': 'en',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  if (bodyString) {
    headers['NDC-MSG-SIG'] = await generateNdcSignature(bodyString);
  }

  if (sid) {
    headers['NDCAUTH'] = `sid=${sid}`;
  }

  return headers;
}
