import { should } from "chai"
import * as tool from "../src/index"

import { IDiffResultModel } from "../lib/model/diff-result-model"

should()

describe("when comparing two identical objects", () => {
  const lhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  it("should return an empty array of differences", () => {
    tool.diff(lhs, rhs, undefined, undefined, (result: IDiffResultModel[]) => {
      result.length.should.equal(0)
    })
  })
})

describe("when comparing two objects with a different value in a property", () => {
  const lhs: Object = { a: { b: 11, c: "Hello" }, d: [1, 2, 3] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  let result: IDiffResultModel[] = []

  before(() => {
    tool.diff(lhs, rhs, undefined, undefined, (dff: IDiffResultModel[]) => {
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
    result[0].resultType.should.equal("difference in element value")
  })
})

describe("when comparing two objects with differences in an array", () => {
  const lhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 4] }
  const rhs: Object = { a: { b: 10, c: "Hello" }, d: [1, 2, 3] }

  let result: IDiffResultModel[] = []

  before(() => {
    tool.diff(lhs, rhs, undefined, undefined, (dff: IDiffResultModel[]) => {
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
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(0)
      }
    )
  })
})

describe("when schema with skip element is provided that is not in rhs xml", () => {
  const schema = { "new-item": { skipKey: true } }

  const lhsxml: string =
    '<string-array name="languages_array"><new-item>hallo</new-item><item>3</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>4</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'

  it("should return an empty array of differences", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      schema,
      undefined,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(1)
      }
    )
  })
})

describe("when comparing two different xml element values with compareElementValues false", () => {
  const optionsNoValueCompare = { compareElementValues: false }

  const lhsxml: string =
    '<string-array name="languages_array"><item>English2</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>English</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'

  it("should return an empty array of differences", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      optionsNoValueCompare,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(0)
      }
    )
  })
})

describe("when comparing two different xml values", () => {
  const lhsxml: string =
    '<string-array name="languages_array"><item>3</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
  const rhsxml: string =
    '<string-array name="languages_array"><item>4</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'

  let result: IDiffResultModel[] = []

  before(() => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (dff: IDiffResultModel[]) => {
        result = dff
      }
    )
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

  let result: IDiffResultModel[] = []

  before(() => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (dff: IDiffResultModel[]) => {
        result = dff
      }
    )
  })

  it("no differences are reported", () => {
    result.length.should.equal(0)
  })
})

describe("when comparing two identical xml strings that have declarations", () => {
  const lhsxml: string =
    '<?xml version="1.0" encoding="UTF-8"?><string-array name="languages_array"><item>English</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'
  const rhsxml: string =
    '<?xml version="1.0" encoding="UTF-8"?><string-array name="languages_array"><item>English</item><item>Chinese</item><item>French</item><item>Spanish</item></string-array>'

  it("should return an empty array of differences without failing to parse the resulting JSON", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(0)
      }
    )
  })
})

describe("when comparing two identical xml strings with only leading/trailing whitespace differences", () => {
  const lhsxml: string = `<root-elem><item1>
Leading and Trailing Line Break
</item1><item2>   Some Leading and Trailing Space   </item2></root-elem>`

  const rhsxml: string = `<root-elem><item1>Leading and Trailing Line Break</item1><item2>Some Leading and Trailing Space</item2></root-elem>`

  it("should return an array of two differences by default", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(2)
      }
    )
  })

  it("no differences are reported if trim xml2js option is set", () => {
    const xml2jsOpts = {
      xml2jsOptions: {
        trim: true
      }
    }

    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      xml2jsOpts,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(0)
      }
    )
  })
})

describe("when comparing two numeric strings with different precision", () => {
  const lhsxml: string = `<root-elem><item1 foo="bar">1.2</item1><item2>1.2</item2><somearray><arrayitem>1.2</arrayitem><arrayitem>1.2</arrayitem><arrayitem>1.2</arrayitem></somearray></root-elem>`
  const rhsxml: string = `<root-elem><item1 foo="bar">1.20</item1><item2>1.20</item2><somearray><arrayitem>1.2</arrayitem><arrayitem>1.20</arrayitem><arrayitem>1.2</arrayitem></somearray></root-elem>`

  it("should return an array of two differences by default", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      undefined,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(3)
      }
    )
  })

  it("no differences are reported if nativeType xml2js option is set", () => {
    const xml2jsOpts = {
      xml2jsOptions: {
        nativeType: true
      }
    }

    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      xml2jsOpts,
      (result: IDiffResultModel[]) => {
        result.length.should.equal(0)
      }
    )
  })
})

describe("when removing _text keys from comparison strings", () => {
  const lhsxml: string = `<root-elem><item1 foo="bar">1.2</item1><item2>2.3</item2><item3>3.0</item3></root-elem>`
  const rhsxml: string = `<root-elem><item1 foo="baz">1.23</item1><item2>2.34</item2><item3>3</item3></root-elem>`

  it("should remove the _text key when attributes are ignored", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      { xml2jsOptions: { ignoreAttributes: true } },
      (result: IDiffResultModel[]) => {
        JSON.stringify(result).should.not.contain("_text")
        result.length.should.equal(3)
      }
    )
  })

  it("should remove the _text key when attributes are ignored and native values are parsed", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      { xml2jsOptions: { ignoreAttributes: true, nativeType: true } },
      (result: IDiffResultModel[]) => {
        JSON.stringify(result).should.not.contain("_text")
        result.length.should.equal(2)
      }
    )
  })

  it("should not remove the _text key for nodes with attribute changes", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      { xml2jsOptions: { ignoreAttributes: false } },
      (result: IDiffResultModel[]) => {
        result.length.should.equal(4)
        JSON.stringify(result[0]).should.contain("_attributes")
        JSON.stringify(result[1]).should.contain("_text")
        JSON.stringify(result[2]).should.not.contain("_text")
        JSON.stringify(result[3]).should.not.contain("_text")
      }
    )
  })

  it("should remove the _text key when attributes are ignored and native values are parsed", () => {
    tool.diffAsXml(
      lhsxml,
      rhsxml,
      undefined,
      { xml2jsOptions: { ignoreAttributes: false, nativeType: true } },
      (result: IDiffResultModel[]) => {
        result.length.should.equal(3)
        JSON.stringify(result[0]).should.contain("_attributes")
        JSON.stringify(result[1]).should.contain("_text")
        JSON.stringify(result[2]).should.not.contain("_text")
      }
    )
  })
})
