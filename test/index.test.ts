import { should } from "chai"
import * as tool from "../src/index"

should()

describe("when comparing two identical objects", () => {
  const lhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  it("should return an empty array of differences", () => {
    tool.diff(lhs, rhs, null, null, (result: Object[]) => {
      result.length.should.equal(0)
    })
  })
})

describe("when comparing two objects with a different value in a property", () => {
  const lhs: Object = { a: { b: 11, c: "Hello" }, d: [1, 2, 3] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  let result: any[] = []

  before(() => {
    tool.diff(lhs, rhs, null, null, (dff: Object[]) => {
      result = dff
    })
  })

  it("should contain one different element", () => {
    result.length.should.equal(1)
  })

  it("should specify the different element", () => {
    result[0].path.should.equal("a.b")
  })

  it("should return the corrent message", () => {
    result[0].type.should.equal("difference in field value")
  })
})

describe("when comparing two objects with differences in an array", () => {
  const lhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 4] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  let result: any[] = []

  before(() => {
    tool.diff(lhs, rhs, null, null, (dff: Object[]) => {
      result = dff
    })
  })

  it("should contain one different element", () => {
    result.length.should.equal(1)
  })

  it("should specify the correct element", () => {
    result[0].path.should.equal("d")
  })
})

describe("when comparing two identical xml strings", () => {
  const lhsxml: string =
    '<string-array name="languages_array"><item>English</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>English</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'

  it("should return an empty array of differences", () => {
    tool.diffAsXml(lhsxml, rhsxml, null, null, (result: Object[]) => {
      result.length.should.equal(0)
    })
  })
})

describe("when comparing two different xml values", () => {
  const lhsxml: string =
    '<string-array name="languages_array"><item>3</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>4</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'

  let result: any[] = []

  before(() => {
    tool.diffAsXml(lhsxml, rhsxml, null, null, (dff: Object[]) => {
      result = dff
    })
  })

  it("should contain one different element", () => {
    result.length.should.equal(1)
  })

  it("should specify the correct element", () => {
    result[0].path.should.equal("string-array.item")
  })
})

describe("when comparing wildcard xml element values", () => {
  const lhsxml: string =
    '<string-array name="languages_array"><item>*</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>Dutch</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'

  let result: any[] = []

  before(() => {
    tool.diffAsXml(lhsxml, rhsxml, null, null, (dff: Object[]) => {
      result = dff
    })
  })

  it("no differences are reported", () => {
    result.length.should.equal(0)
  })
})
