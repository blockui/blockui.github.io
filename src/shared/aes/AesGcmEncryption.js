import {arrayBufferToBase64, base64ToBuffer} from "../functions/common";

export default class AesGcmEncryption {
  static async genKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    const publicKeyJwk = await crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

    const privateKeyJwk = await crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return {publicKeyJwk, privateKeyJwk};
  }

  static async doDeriveKey({publicKeyJwk, privateKeyJwk}) {
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    return await window.crypto.subtle.deriveKey(
      {name: "ECDH", public: publicKey},
      privateKey,
      {name: "AES-GCM", length: 256},
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(plain, derivedKey) {
    try {
      let iv = crypto.getRandomValues(new Uint8Array(12));
      let encoded = new TextEncoder().encode(plain);
      let encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        derivedKey,
        encoded
      );
      return {cipher: arrayBufferToBase64(encryptedData), iv: arrayBufferToBase64(iv)};
    } catch (e) {
      throw Error("error encrypt data")
    }
  }

  static async decrypt(cipher, derivedKey, iv) {
    cipher = base64ToBuffer(cipher)
    let decrypted = await crypto.subtle.decrypt({
      "name": "AES-GCM",
      "iv": base64ToBuffer(iv)
    }, derivedKey, cipher);
    return new TextDecoder().decode(decrypted);
  }
}

/**
 *
 const crypto = require('crypto');
 function t(){
  const crypto = require('crypto');

  const alice = crypto.createECDH('secp256k1');
  alice.generateKeys();

  const bob = crypto.createECDH('secp256k1');
  bob.generateKeys();

  const alicePublicKeyBase64 = alice.getPublicKey().toString('base64');
  const bobPublicKeyBase64 = bob.getPublicKey().toString('base64');

  const aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex');
  const bobSharedKey = bob.computeSecret(alicePublicKeyBase64, 'base64', 'hex');

  console.log(aliceSharedKey === bobSharedKey);
  console.log('Alice shared Key: ', aliceSharedKey);
  console.log('Bob shared Key: ', bobSharedKey);

  const MESSAGE = 'this is some random message...';

  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(aliceSharedKey, 'hex'),
    IV
  );

  let encrypted = cipher.update(MESSAGE, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const auth_tag = cipher.getAuthTag().toString('hex');

  console.table({
    IV: IV.toString('hex'),
    encrypted: encrypted,
    auth_tag: auth_tag
  });

  const payload = IV.toString('hex') + encrypted + auth_tag;

  const payload64 = Buffer.from(payload, 'hex').toString('base64');
  console.log(payload64);

//Bob will do from here
  const bob_payload = Buffer.from(payload64, 'base64').toString('hex');

  const bob_iv = bob_payload.substr(0, 32);
  const bob_encrypted = bob_payload.substr(32, bob_payload.length - 32 - 32);
  const bob_auth_tag = bob_payload.substr(bob_payload.length - 32, 32);

  console.table({ bob_iv, bob_encrypted, bob_auth_tag });

  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(bobSharedKey, 'hex'),
      Buffer.from(bob_iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'));

    let decrypted = decipher.update(bob_encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.table({ DecyptedMessage: decrypted });
  } catch (error) {
    console.log(error.message);
  }

}
 */
