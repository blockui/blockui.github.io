import {isCharacter, maskEmail, isCnMobilePhone, isEmailStr, isUsername, getStrByteLen} from "./string";

test("String",()=>{
  expect(isCharacter("A1z")).toEqual(true)
  expect(isCharacter("11a_-")).toEqual(true)
  expect(isCharacter("_11a_")).toEqual(true)
  expect(isCharacter("_1是1a_")).toEqual(false)
  expect(isCharacter("_1是1……&*（a_")).toEqual(false)
  expect(isUsername("_1是1……&*（a_")).toEqual(false)
  expect(isUsername("assss_")).toEqual(true)
  expect(isUsername("Assss_")).toEqual(true)
  expect(isUsername("_Assss_")).toEqual(false)
  expect(isUsername("1Assss_")).toEqual(false)

  expect(isCnMobilePhone("13222222222")).toEqual(true)
  expect(isCnMobilePhone(134333333333)).toEqual(false)
  expect(isEmailStr("sss@qq.com")).toEqual(true)
  expect(isEmailStr("sssqq.com")).toEqual(false)

})

test("maskEmail",()=>{
  expect(maskEmail("sss@qq.com")).toEqual("ss*@qq.com")
  expect(maskEmail("1234567@qq.com")).toEqual("1234***@qq.com")
})
test("getStrByteLen",()=>{
  expect(getStrByteLen("中")).toEqual(3)
  expect(getStrByteLen("a")).toEqual(1)
  expect(getStrByteLen("中 文a")).toEqual(8)
})
