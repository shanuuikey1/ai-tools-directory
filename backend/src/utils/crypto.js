const crypto = require('crypto');

// AES-256-GCM authenticated field-level encryption for data at rest
// (e.g. Aadhaar numbers, bank account / IFSC details on ServiceProvider).
//
// The key is read from FIELD_ENCRYPTION_KEY and must be 32 bytes, supplied
// as 64 hex characters or 44-char base64. When the key is absent we operate
// in pass-through mode: values are stored as-is and a one-time warning is
// logged. This preserves existing behaviour in environments that have not
// yet provisioned a key while letting production enable encryption with a
// single env var and no code change.
//
// Ciphertext format (single string, so it fits an existing STRING column):
//   enc:v1:<iv_b64>:<authTag_b64>:<ciphertext_b64>
// The `enc:v1:` prefix lets us detect already-encrypted values and decrypt
// transparently, and leaves room for key rotation / versioning later.

const PREFIX = 'enc:v1:';
const ALGO = 'aes-256-gcm';
const IV_BYTES = 12; // 96-bit nonce, the GCM recommended size

let cachedKey = null;
let warnedMissingKey = false;

function loadKey() {
  if (cachedKey !== null) return cachedKey;

  const raw = process.env.FIELD_ENCRYPTION_KEY;
  if (!raw) {
    cachedKey = undefined; // distinguish "looked, none found" from "not looked"
    return cachedKey;
  }

  let buf;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    buf = Buffer.from(raw, 'hex');
  } else {
    buf = Buffer.from(raw, 'base64');
  }

  if (buf.length !== 32) {
    throw new Error(
      'FIELD_ENCRYPTION_KEY must decode to 32 bytes (64 hex chars or base64). ' +
        `Got ${buf.length} bytes.`
    );
  }
  cachedKey = buf;
  return cachedKey;
}

function isEncrypted(value) {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

function encrypt(plaintext) {
  if (plaintext === null || plaintext === undefined || plaintext === '') {
    return plaintext;
  }
  if (isEncrypted(plaintext)) return plaintext; // already encrypted, don't double-wrap

  const key = loadKey();
  if (!key) {
    if (!warnedMissingKey) {
      console.warn(
        '[crypto] FIELD_ENCRYPTION_KEY is not set — sensitive fields are stored ' +
          'WITHOUT encryption. Set a 32-byte key in production.'
      );
      warnedMissingKey = true;
    }
    return plaintext;
  }

  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(String(plaintext), 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return (
    PREFIX +
    iv.toString('base64') +
    ':' +
    authTag.toString('base64') +
    ':' +
    ciphertext.toString('base64')
  );
}

function decrypt(value) {
  if (!isEncrypted(value)) return value; // plaintext / legacy value, return as-is

  const key = loadKey();
  if (!key) {
    // Encrypted data but no key available — fail closed rather than leak.
    throw new Error('FIELD_ENCRYPTION_KEY is required to decrypt stored data.');
  }

  const [, , ivB64, tagB64, dataB64] = value.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const ciphertext = Buffer.from(dataB64, 'base64');

  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

module.exports = { encrypt, decrypt, isEncrypted };
