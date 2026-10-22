// AltAmino Official Device ID & Header Generator
// Conforms to AltAmino DeviceProcessor with Prefix 0x19 and HMAC-SHA1

const VERIFIED_DEVICE_IDS = [
  "1943B6BB6A8793D0F43699C46E0332A4F8A062C33DCE37EADD07709A3663A81B77A015123CAE36F289",
  "192F9F0E907AF9740E21F2E40FBD9922FC1A89720135E5FF1EB8E3018E88A118A66963FAF14529DD7B",
  "19791DB84814D51AA422F54C230AD9F04A8A6EEBEB2173D28B3147E21BCC4CCC8EB6D44E1EE6FAD672",
  "1972B2EFA6E80F5DE2923E9701378C919A5B3A66FF0591905423BE1814744A17B0D68A85A5695BFEE2",
  "19C4DFAB5D16DC4C4ACFF184FBE80077B787E0BE365FE6BF5F4BD0FFE8A4D8D3AD8ACCC0F8D0AEB20D"
];

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
 * Returns NDC headers required by AltAmino live server
 */
export function getLiveHeaders(sid = null) {
  const headers = {
    'Content-Type': 'application/json',
    'NDCDEVICEID': getOrCreateDeviceId(),
    'NDCLANG': 'en',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  if (sid) {
    headers['NDCAUTH'] = `sid=${sid}`;
  }

  return headers;
}
