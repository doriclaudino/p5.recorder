import { Recorder } from "../src/p5.recorder"

describe("smoke tests", () => {
  var recoder = new Recorder("aaa", 1, 2)
  beforeEach(() => {
    recoder = new Recorder("aaa", 1, 2)
  })
  test("toString", () => {
    expect(recoder.toString()).toBe("aaa12")
  })
  test("toHtml", () => {
    recoder.toHtml()
    expect(document.getElementById("divElement")).toBeTruthy()
    expect(document.getElementById(`pElement-${1}`)).toBeTruthy()
    expect(document.getElementById(`pElement-${2}`)).toBeTruthy()
  })
  test("toHtml extra param", () => {
    let params = ["aaa", 1, 2, 3, 4, 5]
    recoder = new Recorder(...params)
    recoder.toHtml()
    expect(document.getElementById("divElement")).toBeTruthy()
    params.forEach(param => expect(document.getElementById(`pElement-${param}`)).toBeTruthy())
  })
})
