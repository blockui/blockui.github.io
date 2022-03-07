import React from "react";
import {
  aesDecrypt,
  aesDecryptCbc256,
  aesDecryptWithIv,
  aesEncrypt,
  aesEncryptCbc256,
  aesEncryptWithIv,
  b64ToHex,
  bytesToHex,
  desDecrypt,
  desEncrypt,
  formatRsaPrvKey,
  formatRsaPubKey,
  genRsaKey,
  hexToB64,
  hexToBytes,
  md5,
  randomString,
  rsaDecryptByPrvKey,
  rsaEncryptByPubKey,
  sha1,
  sha256,
  sha3,
  sha512
} from "./crypto";

test("crypto hash", () => {
  const massage = "a".repeat(128)
  let res = md5(massage)
  console.log(res)
  expect(res.length).toEqual(32);
  res = sha1(massage)
  console.log(res)
  expect(res.length).toEqual(40);
  res = sha3(massage)
  console.log(res)
  expect(res.length).toEqual(128);
  res = sha256(massage)
  console.log(res)
  expect(res.length).toEqual(64);
  res = sha512(massage)
  console.log(res)
  expect(res.length).toEqual(128);
});

test("crypto aes", () => {
  const massage = "啊1*（sss".repeat(1)
  const passwd = randomString(32, 6)
  let res = aesEncrypt(massage, passwd)
  console.log(res)
  const res1 = aesDecrypt(res, passwd)
  console.log(res1)
  expect(res1).toEqual(massage);
});

test("crypto aes iv", () => {
  const massage = "啊1*（sss".repeat(1)
  console.log(massage)
  // const key = randomString(16, 6)
  // const iv = randomString(32, 6)
  const key = md5("ttt")
  const iv = md5("ttt").substring(0, 16)
  console.log(key, iv)
  let res = aesEncryptWithIv(massage, key, iv)
  console.log(res)
  const res1 = aesDecryptWithIv(res, key, iv)
  console.log(res1)
  expect(res1).toEqual(massage);
});
const getCurrentTime = ()=>+(new Date()) / 1000

test("crypto aes cbc 256", () => {
  const key = "key_test"
  const iv = "iv_test"
  const plainStr = "data_test".repeat(50)
  for(let i = 0 ;i < 10 ;i++){
    let statTime =getCurrentTime()
    let cipher1 = aesEncryptCbc256(plainStr, key,iv)
    console.log(getCurrentTime() - statTime,plainStr.length,cipher1.length)
    statTime = getCurrentTime()
    let plainStr1 = aesDecryptCbc256(cipher1, key,iv)
    console.log(getCurrentTime()  - statTime,plainStr1.length)
    expect(plainStr).toEqual(plainStr1);
  }
});

test("crypto des", () => {
  const massage = "啊1*（sss".repeat(1)
  const passwd = '22'
  let res = desEncrypt(massage, passwd)
  console.log(res)
  const res1 = desDecrypt(res, passwd)
  console.log(res1)
  expect(res1).toEqual(massage);
});

test("crypto util", () => {
  const hex = b64ToHex('SGVsbG8sIFdvcmxkIQ==')
  expect(hex).toEqual("48656c6c6f2c20576f726c6421");
  const b64 = hexToB64('48656c6c6f2c20576f726c6421')
  expect(b64).toEqual("SGVsbG8sIFdvcmxkIQ==");

  const bytes = hexToBytes("48656c6c6f2c20576f726c6421");
  const hex1 = bytesToHex(bytes)
  expect(hex1).toEqual("48656c6c6f2c20576f726c6421");
});


test("crypto rsa", () => {
  const rsa1024 = genRsaKey(1024,true);
  const rsa2048 = genRsaKey(2048,true);
  const plainStr = "plainStr"
  const cipherStr = rsaEncryptByPubKey(rsa1024.pub, plainStr)
  const plainStr1 = rsaDecryptByPrvKey(rsa1024.pri,cipherStr)
  expect(plainStr).toEqual(plainStr1);
  expect(cipherStr.length).toEqual(172)
  expect(rsaEncryptByPubKey(rsa2048.pub, plainStr).length).toEqual(344)

  expect(rsaEncryptByPubKey(rsa1024.pub, "中".repeat(114 / 3)).length).toEqual(172)
  expect(rsaEncryptByPubKey(rsa1024.pub, "中".repeat(39)).length).toEqual(344)

  expect(rsaEncryptByPubKey(rsa1024.pub, "a".repeat(114)).length).toEqual(172)
  expect(rsaEncryptByPubKey(rsa1024.pub, "a".repeat(115)).length).toEqual(344)

  expect(rsaEncryptByPubKey(rsa2048.pub, "a".repeat(114)).length).toEqual(344)
  expect(rsaEncryptByPubKey(rsa2048.pub, "a".repeat(115)).length).toEqual(684)
  expect(rsaEncryptByPubKey(rsa2048.pub, "a".repeat(116)).length).toEqual(684)

});
test("rsa test",()=>{
  const prvKey = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCGfoz+ZhxeN5tqmcBuR0ZEs+ocJFdmcwkqWn3BHBCntbcgVHvomLjwYF9aOBQv/9D7+NTFEUM1tqoW7PN70Wv7Dj/ci59ddKoBiqqbgj+Hs6qhXTUVijwc2BdHn+l3VxLqvw65vRT+pouvkKDFdMZ25ueafi/O6wHsfS8QBbA0nWVftA58rWsCJouvNsK4VN/0wOU9F5GB77KbCxxv6QlLdKPCZEXUGCQYjEGF0AW+foaKELDH8b9PL7eMaaDa5Q1VkxsU9EkHw0dYnSdud/HLsIU00uHaVPtayw2e5IPdMRJuZ2Dj8pGMNiDKalPgvy/1hTw9MQLbpuq3Xbgfn0LPAgMBAAECggEAAMCSYSvPhKuGH32dn4BHPg8hEUB4BlRkCee1UbtAl1qTzKpI/gdtv7g5uAdA9RmQJ4gT/zII5q6PWPtFd7QqSxEcKepzPjfhlb9hjz8sa6dU14k9k81VXqtg8hecDIoRlcasM7jrOGI6FV4OecxAGHii1m6ULby3Tu9gK6ptB99mlyOSvgEqBx9jyAamZZeffCZIqevRqE+3+Zw/4S1C8lp7fY6FocwZXIqA0ZTFb3kwemLLp57T6pH6PPi8oYh4gRWI7Nc7n0JOOem0clophbzwsWa/zM8Boz/UeUr80GgP929wCljgKFHo+pPJsc3JK/JVVpR0Wie1ok+6S6ddUQKBgQC5lB9d6yUCs+sCK2IBWG+gxJoxrWofk9DWM1Gsa6dBmJtvZcSo8y7y3egXsAo5J8rzooS7JtZDXJien9A+XSlNKHSOQEG9rKTf+DbxX9zTaN2Ttz0Se0Awzbl/8HHdrj5IssaKpH98Enyy64AStTch70WyjttW7jsDqdRsQUMcmwKBgQC5h+Poo5y18NxnrWK9vMsD0HaR5RM5Y5k+BhSV/IYvbVvj8jeQU0BJAmHOEaPOiYBPuJxnWMNHh8j2Tfu6NG02+XVi220zKIwZY28D4Hi4P5SzjUqadQ86viK/zub9l/afHrxR/bCfynNnjs9hiJCfC44QxhSfjn4D/Fp9MElD3QKBgGBgJ2YL/z2HGG4Y/525QseYMofICov5pQQIxMqpYcQ0L8zLajVfjas9SRI8LyL9om2iohHbmnyDMxN15ZztnsxeTSGvBzUs2rch3c6+vRzhoejbyZC2h2CRBlwGD+xTWC9DAM7xnO9fXnlAylNs3wP1khmoDQr5T5aYdSP/RI4vAoGBAJdSY6wijjXDLzGMtIWGz5rb02mpimV7e8if0viGT7etHY6sx276x+sEe1tE/fL+KV5cd4y/U/8qm9lwv4kfK5j0HC82Qzm/r40hkbF6y1uT2CgebKPQKEzEOblx+usJoAgmXHkPTpj12ey0CSdG6JYgKY460SVWZifAEtoaoRctAoGBAK1q/KYXgSGWvNDLKydPcZ1INgSKhPW7R2MEtEZj1zsB8eQ7D6mkw/ctHMNOXHeMFYjn66i7WR7ChmklInSEU9gF2lHnYxfsIzNsxNgWIA+R1m6i6O7E3VSUn7JmJJln3vVwjwn3bKJHRz+tZP7wSSwo5ZLEvEY7mVuxbfTnIQpH"
  const pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhn6M/mYcXjebapnAbkdGRLPqHCRXZnMJKlp9wRwQp7W3IFR76Ji48GBfWjgUL//Q+/jUxRFDNbaqFuzze9Fr+w4/3IufXXSqAYqqm4I/h7OqoV01FYo8HNgXR5/pd1cS6r8Oub0U/qaLr5CgxXTGdubnmn4vzusB7H0vEAWwNJ1lX7QOfK1rAiaLrzbCuFTf9MDlPReRge+ymwscb+kJS3SjwmRF1BgkGIxBhdAFvn6GihCwx/G/Ty+3jGmg2uUNVZMbFPRJB8NHWJ0nbnfxy7CFNNLh2lT7WssNnuSD3TESbmdg4/KRjDYgympT4L8v9YU8PTEC26bqt124H59CzwIDAQAB"
  const publicKey = formatRsaPubKey(pubKey)
  const privateKey = formatRsaPrvKey(prvKey)
  let cipherStr = rsaEncryptByPubKey(publicKey, "test")
  let plainStr = rsaDecryptByPrvKey(privateKey, cipherStr)
  expect(1).toEqual(1)
})

test("crypto 2048", () => {
  const rsa2048 = genRsaKey(2048,true);
  let plainStr = "中".repeat(38)
  let cipherStr = rsaEncryptByPubKey(rsa2048.pub, plainStr)
  let l1 = cipherStr.length
  expect(l1).toEqual(344)
  let ll1 = aesEncryptCbc256(plainStr,md5("plainStr")).length

  plainStr = "中".repeat(39)
  cipherStr = rsaEncryptByPubKey(rsa2048.pub, plainStr)
  let l2 = cipherStr.length
  let ll2 = aesEncryptCbc256(plainStr,md5("plainStr")).length
  expect(l2).toEqual(684)


  plainStr = "中".repeat(77)
  cipherStr = rsaEncryptByPubKey(rsa2048.pub, plainStr)
  let l3 = cipherStr.length
  let ll3 = aesEncryptCbc256(plainStr,md5("plainStr")).length

  expect(l3).toEqual(684)
  plainStr = "中".repeat(78)
  cipherStr = rsaEncryptByPubKey(rsa2048.pub, plainStr)
  let l4 = cipherStr.length
  let ll4 = aesEncryptCbc256(plainStr,md5("plainStr")).length
  expect(l4).toEqual(1024)

  plainStr = "中".repeat(77 + 38 + 1)
  cipherStr = rsaEncryptByPubKey(rsa2048.pub, plainStr)
  let l5 = cipherStr.length
  let ll5 = aesEncryptCbc256(plainStr,md5("plainStr")).length
  expect(l5).toEqual(1024)
});
//
// test("cryptico",()=>{
//   const passphrase = "test"
//   const MattsRSAkey = cryptico.generateRSAKey(passphrase, 2048)
//   const MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
//   expect(1).toEqual(1);
// })

