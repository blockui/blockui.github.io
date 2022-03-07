import {
  compareVersion,
  getImageExtraData,
  parseImageExtraData,
  parseImageExtraFromMsgContent,
  parseMsgExtraFromContent,
  parseMsgImageWidthHeight
} from "./utils";

test("test getImageExtraData", () => {
  const t1 = getImageExtraData({width: 160, height: 170})
  const t2 = getImageExtraData({width: 180, height: 170})
  const t3 = getImageExtraData({width: 170, height: 170})
  const i1 = parseImageExtraData(t1)
  const i2 = parseImageExtraData(t2)
  const i3 = parseImageExtraData(t3)
  const msgContent = "1|16001673d4iSpsiMxcU6e5iom085mbmN+mafrK1k6avsJty9KX4tGq669dW2srjNzP/6hLsOdr0yY6wJ9gTfczEfHR/uU6t1zgBTYFUXO8ZNoHi3oKsfILGgRLs8Ev50ooVr3DK485Lj8GkMAdzxEgaePkvVkYl6UiNiYE9X68b/R9MQNfZGxhz7hroKB75W02rSwdIETieuzPPym0jqOz37EgFFWJiGLSnYMJEFmgUsSE6pZxU04YtyQLWGQRxI07XPZUlwiQLnxGBHvZIrOUBQXOI6rjV9SIAEcfWn3W1O/F22AZkO7PN88/Ng+krtQBhkgl5IcVO/IYYmxT/XX56LYGNdfU7w=="
  const j = parseImageExtraFromMsgContent(msgContent)
  const j1 = parseImageExtraData(j)
  const k1 = parseMsgImageWidthHeight(msgContent, {
    appMaxWidth: 730, clientWidth: 380, clientHeight: 700
  })
  const k2 = parseMsgImageWidthHeight(msgContent, {
    appMaxWidth: 730, clientWidth: 740, clientHeight: 700
  })

  const msgContent3 = "1|16000673d4iSpsiMxcU6e5iom085mbmN+mafrK1k6avsJty9KX4tGq669dW2srjNzP/6hLsOdr0yY6wJ9gTfczEfHR/uU6t1zgBTYFUXO8ZNoHi3oKsfILGgRLs8Ev50ooVr3DK485Lj8GkMAdzxEgaePkvVkYl6UiNiYE9X68b/R9MQNfZGxhz7hroKB75W02rSwdIETieuzPPym0jqOz37EgFFWJiGLSnYMJEFmgUsSE6pZxU04YtyQLWGQRxI07XPZUlwiQLnxGBHvZIrOUBQXOI6rjV9SIAEcfWn3W1O/F22AZkO7PN88/Ng+krtQBhkgl5IcVO/IYYmxT/XX56LYGNdfU7w=="

  const k3 = parseMsgImageWidthHeight(msgContent3, {
    appMaxWidth: 730, clientWidth: 740, clientHeight: 700
  })
  const k4 = parseMsgExtraFromContent("1|16000673d4iSpsiMxcU6e5iom085mbmN+mafrK1k6avsJty9KX4tGq669dW2srjNzP/6hLsOdr0yY6wJ9gTfczEfHR/uU6t1zgBTYFUXO8ZNoHi3oKsfILGgRLs8Ev50ooVr3DK485Lj8GkMAdzxEgaePkvVkYl6UiNiYE9X68b/R9MQNfZGxhz7hroKB75W02rSwdIETieuzPPym0jqOz37EgFFWJiGLSnYMJEFmgUsSE6pZxU04YtyQLWGQRxI07XPZUlwiQLnxGBHvZIrOUBQXOI6rjV9SIAEcfWn3W1O/F22AZkO7PN88/Ng+krtQBhkgl5IcVO/IYYmxT/XX56LYGNdfU7w==")
  expect(1).toEqual(1)
})
test("compareVersion", () => {
  expect(compareVersion("1.3.4", "1.3.5")).toEqual(true)
  expect(compareVersion("1.3.4", "1.3.1")).toEqual(false)
  expect(compareVersion("1.3.4", "1.3.4")).toEqual(false)
  expect(compareVersion("1.1.4", "1.3.4")).toEqual(true)
  expect(compareVersion("1.1.62", "1.1.63")).toEqual(true)
})
