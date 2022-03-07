import {getCache, setCache} from "./cache";

test("cache",()=>{
  const val = "test_value"
  setCache("key",val)
  const val1 = getCache("key")
  expect(val).toEqual(val1)

  const val_obj = {test:1}
  setCache("key1",val_obj)
  const val_obj1 = getCache("key1")
  expect(val).toEqual(val1)

})
