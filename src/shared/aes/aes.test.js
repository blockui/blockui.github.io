import React from "react";

import AesEncryption from "./AesEncryption";
const getCurrentTime = ()=>+(new Date()) / 1000

function t(keyIterations) {
  const aes = new AesEncryption("cbc",256,keyIterations)
  const data = 'a'.repeat(100)
  const password = 'my super strong password'
  let start = getCurrentTime()
  const encrypt = aes.encrypt(data, password)
  console.log("encrypt: ", getCurrentTime() - start, keyIterations,encrypt)
  start = +(new Date())
  const decrypt = aes.decrypt(encrypt, password)
  console.log("decrypt: ", getCurrentTime() - start,keyIterations,decrypt)
}

test(" AES-256-CBC AesEncryption", () => {
  t(1000)
  expect(1).toEqual(1);
})
