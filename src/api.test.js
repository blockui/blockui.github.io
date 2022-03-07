import React from 'react'
import {postRemote} from "./shared/functions/network";
import BDClient from "./shared/BD/BDClient";
import BDServer from "./shared/BD/BDServer";

test("api/constant", async () => {
  await BDServer.fetchPubKey()
  BDClient.initRsaKey()
  const res = await postRemote("api/constant", {
    app: "main"
  })
  expect(1).toEqual(1);
})


test("api/post", async () => {
  await BDServer.fetchPubKey()
  BDClient.initRsaKey()
  const res = await postRemote("api/post", {
    test: "main"
  })
  expect(1).toEqual(1);
})


test("api/auth/login_with_password", async () => {
  await BDServer.fetchPubKey()
  BDClient.initRsaKey()
  const res = await postRemote("api/auth/login_with_password", {
    username: "Joseph",
    passphrase:"pb1122332211"
  })
  expect(1).toEqual(1);
})
